import { Request, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import { requestOrderBodyType } from "../types/order";
import { Order } from "../models/order.model";
import ApiError from "../utils/errorHanlder";
import { myCache } from "../app";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";



export const createOrder = AsyncHandler(async (req: Request<{}, {}, requestOrderBodyType>, res: Response) => {
    const user = req.user?._id;
    if (!user) {
        throw new ApiError("please login first", 402)
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
    // console.log("req.body",req.body)

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
    invalidateKeys({order:true,product:true,admin:true})

    return res.status(201).json({
        success: true,
        message: "Order created successfully",
        order
    });
});

export const processOrder = AsyncHandler( async (req:Request,res:Response)=>{
    const {id} = req.params
    const order = await Order.findById(id)
    if(!order){
        throw new ApiError("order not found!",404)
    }
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered"
        case "Delivered":
            order.status = "Cancelled"
            break;
        default:
            order.status = "Returned"
    }
    await order.save()
    // Invalidate the cache for the specific order
   invalidateKeys({order:true,admin:true})
    return res
    .json({
        message:"order processed successfully ",
        success:true
    })
})

export const myOrders = AsyncHandler(async (req: Request, res: Response) => {
    const user = req.user?._id
    if (!user) {
        throw new ApiError("User not authenticated", 401);
    }
    const key = `my-orders-${user}`;

    let orders;
    let numberOfOrders;
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key) as string);
    } else {
        orders = await Order.find({ user });
        numberOfOrders = await Order.countDocuments({ user })
        myCache.set(key, JSON.stringify(orders));
        addCacheKey(key)
    }

    return res.status(200).json({
        message: "here is your orders",
        success: true,
        numberOfOrders,
        orders,

    });
})


export const getAllOrders = AsyncHandler(async (req: Request, res: Response) => {
    const key = `all-orders`
    if(myCache.has(key)){
       const cachedOrders =  JSON.parse(myCache.get(key) as string)
        return res.status(200).json({
            message:"all orders!",
            success:true,
            cachedOrders
        })
    }
    const orders = await Order.find({})
    myCache.set(key,JSON.stringify(orders))
    addCacheKey(key)
    return res
        .status(200)
        .json({
            message: "alll orders fetched successfully!",
            success: true,
            orders
        })

})


export const deleteOrder = AsyncHandler( async (req: Request, res: Response)=>{
    const {id} = req.params
    if(!id){
        throw new ApiError("please provide product id", 401);
    }
    await Order.findByIdAndDelete(id)
    invalidateKeys({order:true,admin:true})
    return res
    .status(200)
    .json({
        message:"order deleted successfully!",
        success:true,
    })
})
export const getSingleOrder = AsyncHandler ( async(req: Request, res: Response)=>{
    
    const {id} = req.params
    if(!id){
        throw new ApiError("please provide order id", 401);
    }
    let key = `order-${id}`
    let order;
    if(myCache.has(key)){
        order = JSON.parse(myCache.get(key) as string)
    }else{
        order = await Order.findById(id).populate("user","userName")
        myCache.set(key,JSON.stringify(order))
        addCacheKey(key)
    }
   return res
   .status(200)
   .json({
    message:"your single order",
    success:true,
    order
   })
} )