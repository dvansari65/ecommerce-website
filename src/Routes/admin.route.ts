
import { Admin } from "../middlewares/adminMiddleWare";
import { Router } from "express";
import { 
    totalUsers ,
    // activeUser,
    monthlyUsers,
    dailyUsers,
    bestSellingProduct,

} from "../controllers/stats";
export const adminRouter = Router()

adminRouter.route("/users-count").get(Admin, totalUsers);
// adminRouter.route("/active-user").get(Admin, activeUser);
adminRouter.route("/monthly-users").get(Admin, monthlyUsers);
adminRouter.route("/daily-users").get(Admin, dailyUsers);
adminRouter.route("/all-orders").get(Admin, bestSellingProduct);