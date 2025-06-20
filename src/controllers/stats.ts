

// PRODUCT
import { format } from "path";
import { User } from "../models/user.model";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Review } from "../models/review.model";
import { myCache } from "../app"
import { Product } from "../models/product.model";
import { addCacheKey } from "../utils/invalidateCache";

export const stats = AsyncHandler(async (req: Request, res: Response) => {

    const key = "stats"
    let stats;
    if(myCache.has(key)){
        stats = JSON.parse(myCache.get(key) as string)
    }
    const today = new Date();
    const now = new Date()
    const thisMonth = {
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
        start: new Date(now.getFullYear(), now.getMonth(), 1)
    }

    const lastMonth = {
        end: new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999),
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1)
    }
    const totalUsersCount = User.countDocuments()

    today.setDate(today.getDate() - 1)
        ;
    const dailyUsers = User.find({
        lastTimeActive: { $gte: today }
    }).select("-password -refreshToken")
        ;


    const monthlyUsers = User.find(
        {
            lastTimeActive: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        }
    ).select("-password -refreshToken")
        ;//-------------------------------------------------

    const allOrdersBySellingPrice = Order.aggregate([
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
                quantity: { $first: "$orderItems.quantity" },
                photo: { $first: "$orderItems.photo" },
                totolRevenue: { $sum: "$orderItems.revenue" }
            }
        },
        { $sort: { totalRevenue: 1 } },

        { $limit: 5 }
    ])
        ;
    //----------------------------------------------
    const allReviews = Review.find({}).populate("product", "name").sort({ createdAt: -1 })

    const totalOrdersInLastMonth = await Order.find({
        createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end
        }
    })
    const totalOrdersInThisMonth = Order.find({
        createdAt: {
            $gte: thisMonth.end,
            $lte: thisMonth.start
        }
    })

    const orderStatus = Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])


    const allOrders = await Order.find({})
    const grossIncome = allOrders.reduce((total, order) => {
        return total + (order.total)
    }, 0)
    const TotalRevenue = allOrders.reduce((total, order) => {
        return total + (order.total || 0)
    }, 0)
    const discount = allOrders.reduce((total, order) => {
        return total + (order.discount || 0)
    }, 0)
    const productionCost = allOrders.reduce((total, order) => {
        return total + (order.shippingCharges || 0)
    }, 0)

    const burnt = allOrders.reduce((total, order) => {
        return total + (order.tax || 0)
    }, 0)

    const productsByCategory = Product.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            },

        },
        {
            $sort: { count: -1 }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                count: 1
            }
        }

    ])
    const [totalUsersCountPromise,
        dailyUsersPromise,
        monthlyUsersPromise,
        allOrdersPromise,
        allReviewsPromise,
        totalOrdersInLastMonthPromise,
        totalOrdersInThisMonthPromise,
        orderStatusPromise,
        TotalRevenuePromise,
        productsByCategoryPromise
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
        productsByCategory
    ])
     stats = {
        totalUsersCountPromise,
        dailyUsersPromise,
        monthlyUsersPromise,
        allOrdersPromise,
        allReviewsPromise,
        totalOrdersInLastMonthPromise,
        totalOrdersInThisMonthPromise,
        orderStatusPromise,
        TotalRevenuePromise,
        productsByCategoryPromise
    }
    myCache.set(key,JSON.stringify(stats),3600)
    addCacheKey(key)

    return res
        .status(200)
        .json({
            message: "all stats",
            success: true,
            stats
        })

})


export const pieChart = AsyncHandler(async (req: Request, res: Response) => {
    const key = `key-chart-stats`
    let pieChartStats
    if(myCache.has(key)){
       pieChartStats = JSON.parse(myCache.get(key) as string)
    }else{
        const orderByStatus = Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            }
        ])
        const revenueByCategory = Order.aggregate([
            {
                $unwind: "$orderItems"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.productId",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $addFields: {
                    itemRevenue: {
                        $multiply: ["$orderItems.price", "$orderItems.quantity"]
                    },
                    category: "$productInfo.category"
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalRevenue: { $sum: "$itemRevenue" }
                }
            },
            { $sort: { totalRevenue: -1 } }
        ])
        const [
            orderByStatusPromise,
            revenueByCategoryPromise
        ] = await Promise.all([
            orderByStatus,
            revenueByCategory
        ])
    
         pieChartStats = {
            orderByStatusPromise,
            revenueByCategoryPromise
        }
    }
    return res
        .status(200)
        .json({
            message: "data fetched successfully!",
            success: true,
            pieChartStats
        })
})

export const lineChartStats = AsyncHandler( async (req:Request,res:Response)=>{
    const key = `line-chart-stats`
    let lineChartStats;
    if(myCache.has(key)){
        lineChartStats =  JSON.parse(myCache.get(key) as string)
    }else{
        const now = new Date()
        const today = new Date()
        const thisMonth = {
            end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
            start: new Date(now.getFullYear(), now.getMonth(), 1)
        }
    
        const lastMonth = {
            end: new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999),
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1)
        }
        const totalRevenueInLastMonth = Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:lastMonth.start,
                        $lte:lastMonth.end
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    totalRevenueInLastMonth:{$sum:"$total"}
                }
            }
        ])
        

        const [totalRevenueInLastMonthPromise] = await Promise.all([
            totalRevenueInLastMonth
        ])
        lineChartStats = {
            totalRevenueInLastMonthPromise
        }
        return res
        .status(200)
        .json({
            message:"line charts stats!",
            success:true,
            lineChartStats
        })
    }
})
