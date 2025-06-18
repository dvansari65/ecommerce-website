

// PRODUCT
import { format } from "path";
import { User } from "../models/user.model";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { Request,Response } from "express";
export const totalUsers = AsyncHandler( async (req:Request,res:Response)=>{
    
     const totalUsersCount = await User.countDocuments()
     return res
     .status(200)
     .json({
        success:true,
        message:"total users count",
        totalUsersCount
     })
})

export const activeUser = AsyncHandler( async(req:Request,res:Response)=>{
    const {period="daily"} = req.query
    const today = new Date()
    let startDate = new Date()

    switch (period) {
        case "weekly":
            startDate.setDate(today.getDate()-7)
            break;
        case "monthly":
            startDate.setDate(today.getMonth()-1)
        default:
            startDate.setDate(today.getDate()-1)
            break;
    }
    const registrations = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: period === 'monthly' ? "%Y-%m" : 
                               period === 'weekly' ? "%Y-%U" : "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ]);
    const formatedStats = registrations.map(stat=>({
        date:stat._id,
        newUsers:stat.count
    }))
    // console.log("registrations:",registrations)
    return res
    .status(200)
    .json({
        message:true,
        success:true,
        formatedStats
    })
})