import { Router } from "express";

import { newUser,loginUser } from "../controllers/user.controlller";

export const userRouter = Router()

userRouter.route("/new-user").post(newUser);
userRouter.route("/login").post(loginUser);
