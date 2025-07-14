import { Request, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import { requestOrderBodyType } from "../types/order";
import { Order } from "../models/order.model";
import ApiError from "../utils/errorHanlder";
import redis from "../utils/redis";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";

export const createOrder = AsyncHandler(async (req: Request<{}, {}, requestOrderBodyType>, res: Response) => {
    const user = req.user?._id;
    if (!user) {
        throw new ApiError("Please login first", 402);
    }
    const {
        shippingInfo,
        orderItems,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total
    } = req.body;
    console.log("Incoming order data:", JSON.stringify(req.body, null, 2));
    // Validate required fields
    if (
        shippingInfo == null ||
        orderItems == null ||
        subtotal == null ||
        tax == null ||
        shippingCharges == null ||
        discount == null ||
        total == null
    ) {
        throw new ApiError("All fields are required", 400);
    }

    // Validate shipping info
    const { address, city, state, country, pinCode } = shippingInfo;
    if (!address || !city || !state || !country || !pinCode) {
        throw new ApiError("All shipping information fields are required", 400);
    }

    // Validate order items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        throw new ApiError("Order items are required", 400);
    }

    // Create order
    const order = await Order.create({
        shippingInfo: {
            address,
            city,
            state,
            country,
            pinCode
        },
        orderItems,
        user: user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
        status: "Processing"
    });
    await invalidateKeys({ order: true })
    return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order
    });
});

export const processOrder = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError("Order not found!", 404);
    }
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        case "Delivered":
            order.status = "Cancelled";
            break;
        default:
            order.status = "Returned";
    }
    await order.save();
    await invalidateKeys({ order: true, product: true })
    return res.json({
        message: "Order processed successfully",
        success: true
    });
});

export const myOrders = AsyncHandler(async (req: Request, res: Response) => {
    const user = req.user?._id;
    if (!user) {
        throw new ApiError("User not authenticated", 401);
    }
    const key = `my-orders`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "your orders!",
            success: true,
            orders: JSON.parse(cachedData)
        })
    }
    const orders = await Order.find({ user });
    const numberOfOrders = await Order.countDocuments({ user });
    await redis.set(key, JSON.stringify(key))
    await addCacheKey(key)
    return res.status(200).json({
        message: "Here are your orders",
        success: true,
        numberOfOrders,
        orders
    });
});

export const getAllOrders = AsyncHandler(async (req: Request, res: Response) => {
    const key = `all-orders`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "alll orders fetched successfully!",
            success: true,
            orders: JSON.parse(cachedData)
        })
    }
    const orders = await Order.find({});
    return res.status(200).json({
        message: "All orders fetched successfully!",
        success: true,
        orders
    });
});

export const deleteOrder = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Please provide order ID", 401);
    }
    await Order.findByIdAndDelete(id);
    await invalidateKeys({ order: true, product: true })
    return res.status(200).json({
        message: "Order deleted successfully!",
        success: true
    });
});

export const getSingleOrder = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const key = `single-order-${id}`
    if (!id) {
        throw new ApiError("Please provide order ID", 401);
    }
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "cached data fetched successfully!",
            success: true,
            order: JSON.parse(cachedData)
        })
    }
    const order = await Order.findById(id).populate("user", "userName");
    if (!order) {
        throw new ApiError("Order not found", 404);
    }
    await redis.set(key, JSON.stringify(order))
    addCacheKey(key)
    return res.status(200).json({
        message: "Your single order",
        success: true,
        order
    });
});