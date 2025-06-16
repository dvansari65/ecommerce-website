import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwt } from "../middlewares/authMiddleWare";
import {newProduct,
     updateProduct,
     deleteProduct,
     filterProduct,
     getAllAdminProducts,
     getAllCategories,
     getSingleProduct
    } from "../controllers/product.controller"


export const productRouter = Router()

productRouter.route("/new-product").post(upload.single("photo"),newProduct);
productRouter.route("/update-product/:id").patch(upload.single("photo"), verifyJwt, updateProduct);
productRouter.route("/delete-product/:id").delete(verifyJwt, deleteProduct);
productRouter.route("/filter-product").get(verifyJwt, filterProduct);
productRouter.route("/get-all-product").get(verifyJwt, getAllAdminProducts);
productRouter.route("/get-all-categories").get(verifyJwt, getAllCategories);
productRouter.route("/get-single-product/:productId").get(verifyJwt, getSingleProduct);