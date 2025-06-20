import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwt } from "../middlewares/authMiddleWare";
import { Admin } from "../middlewares/adminMiddleWare";
import {newProduct,
     updateProduct,
     deleteProduct,
     filterProduct,
     getAllAdminProducts,
     getAllCategories,
     getSingleProduct
    } from "../controllers/product.controller"


export const productRouter = Router()

productRouter.route("/filter-product").get(verifyJwt,updateProduct, filterProduct);

productRouter.route("/new-product").post(Admin,upload.single("photo"),newProduct);
productRouter.route("/update-product/:id").patch(upload.single("photo"), Admin, updateProduct);
productRouter.route("/delete-product/:id").delete(Admin, deleteProduct);
productRouter.route("/get-all-product").get(Admin, getAllAdminProducts);
productRouter.route("/get-all-categories").get(Admin, getAllCategories);
productRouter.route("/get-single-product/:id").get(Admin, getSingleProduct);