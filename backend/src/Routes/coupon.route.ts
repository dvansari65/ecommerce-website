import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import { updateLastActive } from "../middlewares/updateLastActiveMiddleWare";
import {
     createPaymentIntentFromCart,
     createCoupon,
     applyDiscount
     } from "../controllers/coupon.controller";
import { Admin } from "../middlewares/adminMiddleWare";
 const couponRouter = Router()


 couponRouter.route("/create-payment").post(verifyJwt,updateLastActive, createPaymentIntentFromCart);
 couponRouter.route("/create-coupon").post( Admin,createCoupon);
 couponRouter.route("/apply-discount").get(verifyJwt, applyDiscount);
 export default couponRouter