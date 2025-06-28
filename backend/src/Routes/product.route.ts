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
     getSingleProduct,
     getAllLatestProduct
    } from "../controllers/product.controller"


export const productRouter = Router()

productRouter.route("/update-product").get(Admin,updateProduct);

productRouter.route("/new-product").post(Admin,upload.single("photo"),newProduct);
productRouter.route("/update-product/:id").patch(upload.single("photo"), Admin, updateProduct);
productRouter.route("/delete-product/:id").delete(Admin, deleteProduct);
productRouter.route("/get-all-product").get( getAllAdminProducts);
productRouter.route("/get-all-categories").get( getAllCategories);
productRouter.route("/get-single-product/:id").get(verifyJwt, getSingleProduct);
productRouter.route("/latest").get(getAllLatestProduct);
productRouter.route("/filter-product").get(filterProduct);