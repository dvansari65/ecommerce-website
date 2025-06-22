import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import { createPaymentIntent } from "../controllers/coupon.controller";
import { updateLastActive } from "../middlewares/updateLastActiveMiddleWare";
 const couponRouter = Router()


 couponRouter.route("/create-payment").post(verifyJwt,updateLastActive, createPaymentIntent);

 export default couponRouter