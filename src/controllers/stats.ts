

// PRODUCT
import { format } from "path";
import { User } from "../models/user.model";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Review } from "../models/review.model";
import { myCache } from "../app";

export const totalUsers = AsyncHandler(async (req: Request, res: Response) => {

    const today = new Date()
    const thisMonth = {
        end:today,
        start:new Date(today.getFullYear(),today.getMonth(),1)
    }

    const lastMonth = {
        end:new Date(today.getFullYear(),today.getMonth(),0),
        start:new Date(today.getFullYear(),today.getMonth()-1,1)
    }
    const totalUsersCount =  User.countDocuments()
   
    today.setDate(today.getDay() - 1)
    ;
    const dailyUsers =  User.find({
        lastTimeActive: { $gte: today }
    })
    ;
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const monthlyUsers =  User.find(
        {
            lastTimeActive: {
                $gte: monthAgo
            }
        }
    )
    ;//-------------------------------------------------

    const allOrders =  Order.aggregate([
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
    const allReviews =  Review.find({}).populate("product","name")
    if(allReviews.length === 0){
        throw new ApiError("no reviews found!",404)
    }
    const totalOrdersInLastMonth  = Order.find({
        createdAt:{$gte:lastMonth.start,
            $lte:lastMonth.end
        }
    })
    const totalOrdersInThisMonth = Review.find({
        createdAt:{
            $gte:thisMonth.end,
            $lte:thisMonth.start
        }
    })

  

})

// export const activeUser = AsyncHandler( async(req:Request,res:Response)=>{
//     const {period="daily"} = req.query
//     const today = new Date()
//     let startDate = new Date()

//     switch (period) {
//         case "weekly":
//             startDate.setDate(today.getDate()-7)
//             break;
//         case "monthly":
//             startDate.setDate(today.getMonth()-1)
//         default:
//             startDate.setDate(today.getDate()-1)
//             break;
//     }
//     const registrations = await User.aggregate([
//         {
//             $match: {
//                 createdAt: { $gte: startDate }
//             }
//         },
//         {
//             $group: {
//                 _id: {
//                     $dateToString: {
//                         format: period === 'monthly' ? "%Y-%m" : 
//                                period === 'weekly' ? "%Y-%U" : "%Y-%m-%d",
//                         date: "$createdAt"
//                     }
//                 },
//                 count: { $sum: 1 }
//             }
//         },
//         {
//             $sort: { "_id": 1 }
//         }
//     ]);
//     const formatedStats = registrations.map(stat=>({
//         date:stat._id,
//         newUsers:stat.count
//     }))
//     // console.log("registrations:",registrations)
//     return res
//     .status(200)
//     .json({
//         message:true,
//         success:true,
//         formatedStats
//     })
// })

export const monthlyUsers = AsyncHandler(async (req: Request, res: Response) => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const monthlyUsers = await User.find(
        {
            lastTimeActive: {
                $gte: monthAgo
            }
        }
    )
    return res.
        status(200)
        .json({
            message: "monthlyUsers!",
            success: true,
            monthlyUsers
        })
})
export const dailyUsers = AsyncHandler(async (req: Request, res: Response) => {
    const daily = new Date()
    daily.setDate(daily.getDay() - 1)

    const dailyUsers = await User.find({
        lastTimeActive: { $gte: daily }
    })
    return res
        .status(200)
        .json({
            message: "daily users!",
            success: true,
            dailyUsers
        })
})

export const bestSellingProduct = AsyncHandler(async (req: Request, res: Response) => {

    const allOrders = await Order.aggregate([
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
    return res
        .status(200)
        .json({
            message: "yours all orders based on selling price!",
            success: true,
            allOrders
        })
})

export const allRatings = AsyncHandler( async (req:Request,res:Response)=>{
    const allReviews = await Review.find({}).populate("product","name")
    if(allReviews.length === 0){
        throw new ApiError("no reviews found!",404)
    }
    return res
    .status(200)
    .json({
        message:"all reviews fetched successfully!",
        success:true,
        allReviews
    })
})
