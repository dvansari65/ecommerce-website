import { Product } from "../models/product.model";
import { Review } from "../models/review.model";
import { productIdType, reviewPropsType } from "../types/types";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { Request, Response } from "express";

export const addReview = AsyncHandler(async (req: Request<productIdType, {}, reviewPropsType>, res: Response) => {
    const { comment, rating } = req.body;
    const { productId } = req.params;
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

    return res.status(200).json({
        success: true,
        message: "Review added successfully",
        review
    });
});

export const deleteReview = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Please provide review ID", 402);
    }
    const [deleteReview, reviewCount] = await Promise.all([
        Review.findByIdAndDelete(id),
        Review.countDocuments({})
    ]);

    return res.status(200).json({
        message: "Review deleted successfully!",
        success: true,
        reviewCount,
        deleteReview
    });
});

export const getAllReviews = AsyncHandler(async (req: Request, res: Response) => {
    const allReviews = await Review.find({});
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
    const review = await Review.findById(id);
    if (!review) {
        throw new ApiError("Review not found", 404);
    }

    return res.status(200).json({
        message: "Review successfully fetched!",
        success: true,
        review
    });
});