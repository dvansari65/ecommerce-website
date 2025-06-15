import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwt } from "../middlewares/authMiddleWare";
import {newProduct, updateProduct,deleteProduct} from "../controllers/product.controller"


export const productRouter = Router()

productRouter.route("/new-product").post(upload.single("photo"),newProduct);
productRouter.route("/update-product/:id").patch(upload.single("photo"), verifyJwt, updateProduct);
productRouter.route("/delete-product/:id").delete(verifyJwt, deleteProduct);