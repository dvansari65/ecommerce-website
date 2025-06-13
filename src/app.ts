

import cors from "cors"
import express from "express";



const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use(express.json()); 

app.use(cors())

import { userRouter } from "./Routes/user.routes";

app.use("/api/v1/user",userRouter)


export default app