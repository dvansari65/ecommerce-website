import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import { createPaymentIntent } from "../controllers/coupon.controller";
 const couponRouter = Router()


 couponRouter.route("/create-payment").post(verifyJwt, createPaymentIntent);

 export default couponRouter