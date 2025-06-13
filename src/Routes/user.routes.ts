import { Router } from "express";

import { newUser } from "../controllers/user.controlller";

export const userRouter = Router()

userRouter.route("/new-user").post(newUser);

