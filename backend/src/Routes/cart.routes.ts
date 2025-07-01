import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import {createCart,decreaseProductQuantity} from "../controllers/cart.controller"



export const cartRouter = Router()
cartRouter.route("/create-cart/:productId").post(verifyJwt,createCart);
cartRouter.route("/decrease-quantity").post(verifyJwt,decreaseProductQuantity);
