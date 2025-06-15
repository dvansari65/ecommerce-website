

import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express";




const app = express()

app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use(express.json()); 



import { userRouter } from "./Routes/user.routes";
import { productRouter } from "./Routes/product.route";
app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)


export default app