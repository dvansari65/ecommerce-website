
import { Admin } from "../middlewares/adminMiddleWare";
import { Router } from "express";
import { 
    totalUsers ,
    activeUser

} from "../controllers/stats";
export const adminRouter = Router()

adminRouter.route("/users-count").get(Admin, totalUsers);
adminRouter.route("/active-user").get(Admin, activeUser);