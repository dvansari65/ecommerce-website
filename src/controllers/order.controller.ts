import { Request, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import { requestOrderBodyType } from "../types/order";
import { Order } from "../models/order.model";
import ApiError from "../utils/errorHanlder";

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

    // Validate required fields
    if (!shippingInfo || !orderItems || !subtotal || !shippingCharges || !discount || !total) {
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

    const orders = await Order.find({ user });
    const numberOfOrders = await Order.countDocuments({ user });

    return res.status(200).json({
        message: "Here are your orders",
        success: true,
        numberOfOrders,
        orders
    });
});

export const getAllOrders = AsyncHandler(async (req: Request, res: Response) => {
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

    return res.status(200).json({
        message: "Order deleted successfully!",
        success: true
    });
});

export const getSingleOrder = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Please provide order ID", 401);
    }

    const order = await Order.findById(id).populate("user", "userName");
    if (!order) {
        throw new ApiError("Order not found", 404);
    }

    return res.status(200).json({
        message: "Your single order",
        success: true,
        order
    });
});