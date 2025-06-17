

import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express";
import NodeCache from "node-cache";
const app = express()
import Stripe from "stripe";

app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

export const myCache = new NodeCache()
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
    apiVersion: '2023-10-16' as any
})
app.use(express.json()); 



import { userRouter } from "./Routes/user.routes";
import { productRouter } from "./Routes/product.route";
import { orderRouter } from "./Routes/order.route";
import couponRouter from "./Routes/coupon.route";
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/order",orderRouter)
app.use("/api/v1/coupon",couponRouter)

export default app