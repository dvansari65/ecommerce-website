import { verifyJwt } from "../middlewares/authMiddleWare";
import { Router } from "express";
import {createCart,
    decreaseProductQuantity,
    getAllCartProducts,
    deleteCart,
    getAllCarts,
    increaseQuantity,
    getSingleProductFromCart,
    cartDetails,
    deleteProductFromCart,
    clearCart

} from "../controllers/cart.controller"



export const cartRouter = Router()
cartRouter.route("/create-cart/:productId").post(verifyJwt,createCart);
cartRouter.route("/decrease-quantity/:productId").post(verifyJwt,decreaseProductQuantity);
cartRouter.route("/get-cart-products").get(verifyJwt,getAllCartProducts);
cartRouter.route("/deleteCart").delete(verifyJwt,deleteCart);
cartRouter.route("/allCarts").get(verifyJwt,getAllCarts);
cartRouter.route("/increase-quantity/:productId").post(verifyJwt,increaseQuantity);
cartRouter.route("/getSingleProduct/:productId").get(verifyJwt,getSingleProductFromCart);

cartRouter.route("/delete-product/:productId").delete(verifyJwt,deleteProductFromCart);
cartRouter.route("/cart-details").get(verifyJwt,cartDetails);

cartRouter.route("/clear-cart").delete(verifyJwt,clearCart);