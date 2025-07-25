import { Product } from "../models/product.model";
import { Review } from "../models/review.model";
import { productIdType, reviewPropsType } from "../types/types";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { Request, Response } from "express";
import redis from "../utils/redis";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";


export const addReview = AsyncHandler(async (req: Request<productIdType, {}, reviewPropsType>, res: Response) => {
    // console.log("re.body:",req.body)
    const { comment, rating } = req.body;
    const { productId } = req.query;
    const user = req.user;

    if (!user) {
        throw new ApiError("Please login", 402);
    }
    if (!productId || !rating || typeof rating !== "number") {
        throw new ApiError("Please provide product ID and ratings", 402);
    }
    const product = await Product.findById(productId).select("name category");
    if (!product) {
        throw new ApiError("Product not found!", 402);
    }
    const review = await Review.create({
        comment,
        rating,
        user,
        product
    });
    invalidateKeys({ review: true, admin: true, user: true, product: true })

    return res.status(200).json({
        success: true,
        message: "Review added successfully",
        review
    });
})

export const deleteReview = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Please provide review ID", 402);
    }
    const [deleteReview, reviewCount] = await Promise.all([
        Review.findByIdAndDelete(id),
        Review.countDocuments({})
    ]);
    invalidateKeys({ review: true, admin: true, product: true, user: true })
    return res.status(200).json({
        message: "Review deleted successfully!",
        success: true,
        reviewCount,
        deleteReview
    });
});

export const getAllReviews = AsyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const limit = Number(process.env.REVIEW_PER_PAGE) || 4
    const skip = (page - 1) * limit
    const key = `all-reviews-${page}-${limit}`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "all reviews fetched successfully!",
            success: true,
            allReviews: JSON.parse(cachedData)
        })
    }
    const allReviews = await Review.find({}).limit(limit).skip(skip).sort({ createdAt: -1 });
    if (!allReviews) {
        throw new ApiError("not fetched all reviews", 404)
    }
    await redis.set(key, JSON.stringify(allReviews))
    await addCacheKey(key)
    return res.status(200).json({
        message: "All reviews fetched!",
        success: true,
        allReviews
    });
});

export const getRview = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Please provide review ID", 402);
    }
    const key = `single-review-${id}`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "single review fetched!",
            success: true,
            review: JSON.parse(cachedData)
        })
    }
    const review = await Review.findById(id);
    if (!review) {
        throw new ApiError("Review not found", 404);
    }
    await redis.set(key, JSON.stringify(review))
    await addCacheKey(key)
    return res.status(200).json({
        message: "Review successfully fetched!",
        success: true,
        review
    });
});

export const getProductReview = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError("please provide product id!", 402)
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.REVIEW_PER_PAGE) || 10;
    const skip = (page - 1) * limit

    const key = `single-product-review-${id}-${page}-${limit}`
    const cachedData = await redis.get(key)
    if (cachedData && cachedData !== null) {
        return res.status(200).json({
            message: "your product reviews!",
            success: true,
            reviews: JSON.parse(cachedData)
        })
    }
    const reviews = await Review.find({ product: id })
    .populate("user", "userName")
    .populate("product", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

    if (!reviews && reviews == null) {
        return res.status(402).json({
            message: "no reviews found!",
            success: false
        })
    }
    const totalPage = Math.ceil(reviews.length / limit)
    await redis.set(key, JSON.stringify(reviews))
    await addCacheKey(key)
    return res.status(200).json({
        message: "there are products reviews!",
        success: true,
        reviews,
        totalPage
    })
})

