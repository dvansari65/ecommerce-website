import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import {createCart} from "../controllers/cart.controller"



export const cartRouter = Router()
cartRouter.route("/create-cart/:productId").post(verifyJwt,createCart);

