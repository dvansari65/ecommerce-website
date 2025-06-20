import { myCache } from "../app";
import { Product } from "../models/product.model";
import { Review } from "../models/review.model";
import { productIdType, reviewPropsType } from "../types/types";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { Request, Response } from "express";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";

export const addReview = AsyncHandler(async (req: Request<productIdType, {}, reviewPropsType>, res: Response) => {
    const { comment, rating } = req.body;
    const { productId } = req.params;
    const user = req.user;

    if (!user) {
        throw new ApiError("please login", 402);
    }
    if (!productId || !rating || (typeof rating !== "number")) {
        throw new ApiError("please provide product ID and ratings", 402);
    }
    const product = await Product.findById(productId).select("name category ")
    if (!product) {
        throw new ApiError("product not found!", 402);
    }
    const review = await Review.create({
        comment,
        rating,
        user,
        product
    });
    invalidateKeys({review:true,product:true})

    return res.status(200).json({
        success: true,
        message: "Review added successfully",
        review
    });
});

export const deleteReview = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError("please provide id", 402);
    }
    const [deleteReview, reviewCount] = await Promise.all([
        Review.findByIdAndDelete(id),
        Review.countDocuments({})
    ])
    invalidateKeys({review:true,product:true})
    return res
        .status(200)
        .json(
            {
                message: "review deleted successfully!",
                success: true,
                reviewCount,
                deleteReview
            }
        )
})


export const getAllReviews = AsyncHandler(async (req: Request, res: Response) => {
    const key = "all-reviews"
    let allReviews
    if (myCache.has(key)) {
        allReviews = JSON.parse(myCache.get(key) as string)
        return res.status(200).json({
            message: "yours all reviews!",
            success: true,
            allReviews
        })
    } else {
        allReviews = await Review.find({})
        myCache.set(key, JSON.stringify(allReviews))
        addCacheKey(key)
        return res
            .status(200)
            .json(
                {
                    message: "all reviews fetched!",
                    success: true,
                    allReviews
                }
            )
    }
})

export const getRview = AsyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params
    const key = "single-review"
    let review
    if (!reviewId) {
        throw new ApiError("please provide review id ", 402)
    }
    if (myCache.has(key)) {
        review = JSON.parse(myCache.get(key) as string)
        res.status(200).json({
            message: "single review obtain!",
            success: true,
            review
        })
    } else {
        review = await Review.findById(reviewId)
        if (!review) {
            throw new ApiError("review not found", 404)
        }
        myCache.set(key, JSON.stringify(review))
        addCacheKey(key)
        return res
            .status(200)
            .json({
                message: "review successfully fetched!",
                success: true,
                review
            })

    }

})

