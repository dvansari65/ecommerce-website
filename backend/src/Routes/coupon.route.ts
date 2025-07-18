import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import { updateLastActive } from "../middlewares/updateLastActiveMiddleWare";
import {
     createPaymentIntentFromCart,
     createPaymentIntentDirectly,
     createCoupon,
     applyDiscount,
     deleteCoupon
     } from "../controllers/coupon.controller";
import { Admin } from "../middlewares/adminMiddleWare";
 const couponRouter = Router()



 couponRouter.route("/create-payment-from-cart").post(verifyJwt,updateLastActive, createPaymentIntentFromCart);
 couponRouter.route("/create-payment-directly").post(verifyJwt,updateLastActive, createPaymentIntentDirectly);
 couponRouter.route("/apply-discount").get(verifyJwt, applyDiscount);
 couponRouter.route("/delete-coupon/:id").delete(verifyJwt, deleteCoupon);

//  admin route
couponRouter.route("/create-coupon").post( Admin,createCoupon);
 export default couponRouter