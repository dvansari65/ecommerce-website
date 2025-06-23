

// PRODUCT

import { User } from "../models/user.model";
import AsyncHandler from "../utils/asyncHandler";

import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Review } from "../models/review.model";

import { Product } from "../models/product.model";
import redis from "../utils/redis";
import { addCacheKey } from "../utils/invalidateCache";
// import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";

export const stats = AsyncHandler(async (req: Request, res: Response) => {
    const key = "stats";

    // Check Redis cache
    const cachedStats = await redis.get(key);
    if (cachedStats) {
        return res.status(200).json({
            message: "Stats fetched successfully (from cache)!",
            success: true,
            stats: JSON.parse(cachedStats),
        });
    }

    const today = new Date();
    const now = new Date();

    const thisMonth = {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
    };

    const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999),
    };

    // Data queries (async)
    const totalUsersCount = User.countDocuments();

    today.setDate(today.getDate() - 1);
    const dailyUsers = User.find({ lastTimeActive: { $gte: today } }).select("-password -refreshToken");
    const monthlyUsers = User.find({
        lastTimeActive: {
            $gte: thisMonth.start,
            $lte: thisMonth.end,
        },
    }).select("-password -refreshToken");

    const allOrdersBySellingPrice = Order.aggregate([
        { $unwind: "$orderItems" },
        {
            $addFields: {
                "orderItems.revenue": {
                    $multiply: ["$orderItems.price", "$orderItems.quantity"],
                },
            },
        },
        {
            $group: {
                _id: "$orderItems.productId",
                name: { $first: "$orderItems.name" },
                quantity: { $first: "$orderItems.quantity" },
                photo: { $first: "$orderItems.photo" },
                totalRevenue: { $sum: "$orderItems.revenue" },
            },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
    ]);

    const allReviews = Review.find({}).populate("product", "name").sort({ createdAt: -1 });

    const totalOrdersInLastMonth = Order.find({
        createdAt: {
            $gte: lastMonth.start,
            $lte: lastMonth.end,
        },
    });

    const totalOrdersInThisMonth = Order.find({
        createdAt: {
            $gte: thisMonth.start,
            $lte: thisMonth.end,
        },
    });

    const orderStatus = Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const allOrders = Order.find({});

    const productsByCategory = Product.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                _id: 0,
                category: "$_id",
                count: 1,
            },
        },
    ]);

    // Await all data together
    const [
        usersCount,
        usersDaily,
        usersMonthly,
        bestSellingProducts,
        reviews,
        ordersLastMonth,
        ordersThisMonth,
        status,
        allOrdersData,
        categoryDistribution,
    ] = await Promise.all([
        totalUsersCount,
        dailyUsers,
        monthlyUsers,
        allOrdersBySellingPrice,
        allReviews,
        totalOrdersInLastMonth,
        totalOrdersInThisMonth,
        orderStatus,
        allOrders,
        productsByCategory,
    ]);

    const revenue = allOrdersData.reduce((sum, order) => sum + (order.total || 0), 0);
    const discount = allOrdersData.reduce((sum, order) => sum + (order.discount || 0), 0);
    const shippingCharges = allOrdersData.reduce((sum, order) => sum + (order.shippingCharges || 0), 0);
    const tax = allOrdersData.reduce((sum, order) => sum + (order.tax || 0), 0);

    const stats = {
        usersCount,
        usersDaily,
        usersMonthly,
        bestSellingProducts,
        reviews,
        ordersLastMonth,
        ordersThisMonth,
        status,
        revenue,
        discount,
        shippingCharges,
        tax,
        categoryDistribution,
    };

    await redis.set(key, JSON.stringify(stats), "EX", 3600);
    await addCacheKey(key);

    return res.status(200).json({
        message: "All stats fetched successfully",
        success: true,
        stats,
    });
});


export const pieChart = AsyncHandler(async (req: Request, res: Response) => {
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
    const revenueByCategory = await Order.aggregate([
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

    const pieChartStats = {
        orderByStatusPromise,
        revenueByCategoryPromise
    }
    return res
        .status(200)
        .json({
            message: "chart stats",
            success: true,
            pieChartStats
        })
})

export const lineChartStats = AsyncHandler(async (req: Request, res: Response) => {
    const key = `line-chart-stats`
    let lineChartStats;

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
    const totalRevenueInLastMonth = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenueInLastMonth: { $sum: "$total" }
            }
        }
    ])
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

    const totalRevenueLastMonth = totalRevenueInLastMonth[0]?.totalRevenueInLastMonth || 0
    // ... existing code ...
    // const topBuyers = await Order.aggregate([
    //     {
    //         $unwind: "$orderItems"
    //     },
    //     {
    //         $addFields: {
    //             itemRevenue: {
    //                 $multiply: ["$orderItems.price", "$orderItems.quantity"]
    //             }
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: "$user",
    //             totalSpent: { $sum: "$itemRevenue" },
    //             productIds: { $addToSet: "$orderItems.productId" }
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "_id",
    //             foreignField: "_id",
    //             as: "userInfo"
    //         }
    //     },
    //     {
    //         $unwind: "$userInfo"
    //     },
    //     {
    //         $lookup: {
    //             from: "products",
    //             let: { prodIds: "$productIds" },
    //             pipeline: [
    //                 {
    //                     $match: {
    //                         $expr: {
    //                             $in: ["$_id", "$$prodIds"]
    //                         }
    //                     }
    //                 },
    //                 { $project: { name: 1 } }
    //             ],
    //             as: "productsBought"
    //         }
    //     },
    //     {
    //         $sort: { totalSpent: -1 }
    //     },
    //     {
    //         $limit: 5
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             userId: "$_id",
    //             userName: "$userInfo.userName",
    //             totalSpent: 1,
    //             productsBought: {
    //                 $map: {
    //                     input: "$productsBought",
    //                     as: "product",
    //                     in: "$$product.name"
    //                 }
    //             }
    //         }
    //     }
    // ]);
    // // ... existing code ...
    const allOrders = await Order.find({})
    const topBuyers = await Promise.all(
        allOrders.map(async item => {
            const orderItems = item.orderItems
            const totalRevenuByProduct = orderItems.reduce((total, cur) => {
                return total + (cur.price!) * (cur.quantity || 1)
            }, 0)
            const productIds = orderItems.map(i => i.productId)
            const products = await Product.find({ _id: { $in: productIds } }).select("category name");
            const user = await User.findById(item.user).select("userName")
            return {
                totalRevenuByProduct,
                products,
                user
            }
        })
    )


    const [
        totalRevenueInLastMonthPromise,
        dailyUsersPromise,
        monthlyUsersPromise,
        topBuyersPromise
    ] = await Promise.all([
        totalRevenueLastMonth,
        dailyUsers,
        monthlyUsers,
        topBuyers
    ])
    lineChartStats = {
        totalRevenueInLastMonthPromise,
        dailyUsersPromise,
        monthlyUsersPromise,
        topBuyersPromise
    }
    // myCache.set(key,JSON.stringify(lineChartStats),3600)
    // addCacheKey(key)
    await redis.set(key,JSON.stringify(lineChartStats))
    await addCacheKey(key)
    return res
        .status(200)
        .json({
            message: "line charts stats!",
            success: true,
            lineChartStats
        })
}
)

