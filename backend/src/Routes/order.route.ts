import { Router } from "express";
import { Admin } from "../middlewares/adminMiddleWare";
import { verifyJwt } from "../middlewares/authMiddleWare";
import {
    myOrders,
    createOrder,
    getAllOrders,
    deleteOrder,
    getSingleOrder,
    increaseQuantity,
    deleteAllOrders
} from "../controllers/order.controller"
import { updateLastActive } from "../middlewares/updateLastActiveMiddleWare";


export const orderRouter = Router()
orderRouter.route("/my-orders").get(verifyJwt,updateLastActive, myOrders);
orderRouter.route("/create-order").post(verifyJwt, updateLastActive,createOrder);
orderRouter.route("/delete-order/:id").delete(verifyJwt,updateLastActive, deleteOrder);
orderRouter.route("/increase-quantity").put(verifyJwt,updateLastActive, increaseQuantity);



orderRouter.route("/single-order/:id").get(Admin, getSingleOrder);
orderRouter.route("/all-orders").get(Admin, getAllOrders);
orderRouter.route("/delete-all-order").delete(Admin, deleteAllOrders);