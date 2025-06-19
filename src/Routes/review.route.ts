import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import { Admin } from "../middlewares/adminMiddleWare";

export const reviewtRouter = Router()

import { addReview, deleteReview, getAllReviews,getRview } from "../controllers/review.controller";
import { updateLastActive } from "../middlewares/updateLastActiveMiddleWare";

reviewtRouter.route("/add-review/:productId").post(verifyJwt,updateLastActive, addReview);


reviewtRouter.route("/add-review/:productId").delete(Admin, deleteReview);

reviewtRouter.route("/add-review/:productId").get(Admin, getAllReviews);
reviewtRouter.route("/add-review/:productId").get(Admin, getRview);
