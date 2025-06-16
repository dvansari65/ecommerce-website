

import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express";
import NodeCache from "node-cache";
const app = express()

export const myCache = new NodeCache()

app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use(express.json()); 



import { userRouter } from "./Routes/user.routes";
import { productRouter } from "./Routes/product.route";
import { orderRouter } from "./Routes/order.route";
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/order",orderRouter)

export default app