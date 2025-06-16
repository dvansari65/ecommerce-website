import { Router } from "express";

import { verifyJwt } from "../middlewares/authMiddleWare";
import {
    myOrders,
    createOrder,
    getAllOrders,
    deleteOrder,
    getSingleOrder
} from "../controllers/order.controller"


export const orderRouter = Router()
orderRouter.route("/my-orders").get(verifyJwt, myOrders);
orderRouter.route("/create-order").post(verifyJwt, createOrder);
orderRouter.route("/all-orders").get(verifyJwt, getAllOrders);
orderRouter.route("/delete-order/:orderId").delete(verifyJwt, deleteOrder);
orderRouter.route("/single-order/:id").get(verifyJwt, getSingleOrder);