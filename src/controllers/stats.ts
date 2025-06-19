

// PRODUCT
import { format } from "path";
import { User } from "../models/user.model";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Review } from "../models/review.model";
import { myCache } from "../app"

export const stats = AsyncHandler(async (req: Request, res: Response) => {

    const today = new Date();
    const now = new Date()
    const thisMonth = {
        end:new Date(now.getFullYear(),now.getMonth()+1,0,23,59,59,999),
        start:new Date(now.getFullYear(),now.getMonth(),1)
    }

    const lastMonth = {
        end:new Date(today.getFullYear(),today.getMonth(),0,23,59,59,999),
        start:new Date(today.getFullYear(),today.getMonth()-1,1)
    }
    const totalUsersCount =  User.countDocuments()
   
    today.setDate(today.getDate() - 1)
    ;
    const dailyUsers =  User.find({
        lastTimeActive: { $gte: today }
    }).select("-password -refreshToken")
    ;
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const monthlyUsers =  User.find(
        {
            lastTimeActive: {
                $gte: monthAgo
            }
        }
    ).select("-password -refreshToken")
    ;//-------------------------------------------------

    const allOrdersBySellingPrice =  Order.aggregate([
        { $unwind: "$orderItems" },

        {
            $addFields: {
              "orderItems.revenue": {
                $multiply: ["$orderItems.price", "$orderItems.quantity"]
              }
            }
          },
      
            {
            $group: {
                _id: "$orderItems.productId",
                name: { $first: "$orderItems.name" },
                quantity:{$first:"$orderItems.quantity"},
                photo: { $first: "$orderItems.photo" },
                totolRevenue: { $sum: "$orderItems.revenue" }
            }
        },
        { $sort: { totalRevenue: 1 } },

        {$limit:5}
    ])
    ;
    //----------------------------------------------
    const allReviews =  Review.find({}).populate("product","name").sort({createdAt:-1})
    
    const totalOrdersInLastMonth  = await Order.find({
        createdAt:{$gte:lastMonth.start,
            $lte:lastMonth.end
        }
    })
    const totalOrdersInThisMonth = Order.find({
        createdAt:{
            $gte:thisMonth.end,
            $lte:thisMonth.start
        }
    })

    const orderStatus = Order.aggregate([
        {
            $group:{
                _id:"$status",
                count:{$sum:1}
            }
        }
    ])
   
    
    const allOrders  = await  Order.find({})
    const TotalRevenue = allOrders.reduce((total,order)=>{
            return total + (order.total || 0)
    },0)
   
    const [totalUsersCountPromise,
        dailyUsersPromise,
        monthlyUsersPromise,
        allOrdersPromise,
        allReviewsPromise,
        totalOrdersInLastMonthPromise,
        totalOrdersInThisMonthPromise,
        orderStatusPromise,
        TotalRevenuePromise ,
        revenueInLastMonthPromise
    ] = await Promise.all([
        totalUsersCount,
        dailyUsers,
        monthlyUsers,
        allOrdersBySellingPrice,
        allReviews,
        totalOrdersInLastMonth,
        totalOrdersInThisMonth,
        orderStatus,
        TotalRevenue,
        revenueInLastMonth
    ])
    const stats ={
        totalUsersCountPromise,
        dailyUsersPromise,
        monthlyUsersPromise,
        allOrdersPromise,
        allReviewsPromise,
        totalOrdersInLastMonthPromise,
        totalOrdersInThisMonthPromise,
        orderStatusPromise,
        TotalRevenuePromise,
        revenueInLastMonthPromise
    } 
    return res
    .status(200)
    .json({
        message:"all stats",
        success:true,
        stats
    })

})

