
import { Admin } from "../middlewares/adminMiddleWare";
import { Router } from "express";
import { 
    stats

} from "../controllers/stats";
export const adminRouter = Router()

adminRouter.route("/stats").get(Admin, stats);
