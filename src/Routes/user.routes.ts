import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import { Admin } from "../middlewares/adminMiddleWare";
import { newUser,
    loginUser,
    logoutUser,
    updateUserNameFromProfile ,
    updatePhoto,
    getAllUser,
    updateUser,
    getSingleUser,
    deleteUser
} from "../controllers/user.controlller";
import { verifyJwt } from "../middlewares/authMiddleWare";
export const userRouter = Router()

userRouter.route("/new-user").post(upload.single("photo"),newUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJwt,logoutUser);
userRouter.route("/update-username").post(verifyJwt,updateUserNameFromProfile);
userRouter.route("/update-photo").post(verifyJwt,upload.single("photo"),updatePhoto);
userRouter.route("/update-user").patch(verifyJwt,updateUser);

//  admin only actvities ____

userRouter.route("/get-all-users").get(Admin,getAllUser);
userRouter.route("/get-single-user/:id").get(Admin,getSingleUser);
userRouter.route("/delete-user/:id").delete(Admin,deleteUser);