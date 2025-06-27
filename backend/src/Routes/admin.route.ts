
import { Admin } from "../middlewares/adminMiddleWare";
import { Router } from "express";
import { 
    stats,
    pieChart,
    lineChartStats,
    invaliddateAll
} from "../controllers/stats";
export const adminRouter = Router()

adminRouter.route("/stats").get(Admin, stats);
adminRouter.route("/pie-stats").get(Admin, pieChart);
adminRouter.route("/line-stats").get(Admin, lineChartStats);
adminRouter.route("/invalidate-all").get(Admin, invaliddateAll);