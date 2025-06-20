
import { Admin } from "../middlewares/adminMiddleWare";
import { Router } from "express";
import { 
    stats,
    pieChart
} from "../controllers/stats";
export const adminRouter = Router()

adminRouter.route("/stats").get(Admin, stats);
adminRouter.route("/pie-stats").get(Admin, pieChart);