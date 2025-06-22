
import { Admin } from "../middlewares/adminMiddleWare";
import { Router } from "express";
import { 
    stats,
    pieChart,
    lineChartStats
} from "../controllers/stats";
export const adminRouter = Router()

adminRouter.route("/stats").get(Admin, stats);
adminRouter.route("/pie-stats").get(Admin, pieChart);
adminRouter.route("/line-stats").get(Admin, lineChartStats);