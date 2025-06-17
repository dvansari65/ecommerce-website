import AsyncHandler from "../utils/asyncHandler";
import { Response, Request } from "express";
import ApiError from "../utils/errorHanlder";
import { OrderItemType, shippingInfoType } from "../types/order";
import { User } from "../models/user.model";
import { Coupon } from "../models/coupon.model";
import { Product } from "../models/product.model";
import { stripe } from "../app";

export const createPaymentIntent = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError("please login~", 402)
    }
    const user = await User.findById(userId)
    const {
        shoppingInfo,
        orderItems,
        code
    }
        : {
            shoppingInfo: shippingInfoType,
            orderItems: OrderItemType[],
            code: string
        }
        = req.body

    if (!orderItems) {
        throw new ApiError("please enter items", 404)
    }
    if (!shoppingInfo) {
        throw new ApiError("please enter shopping info", 404)
    }

    let discountAmount = 0;
    const coupon = await Coupon.findOne({ code: code })
    if (!coupon) {
        throw new ApiError("invalid coupon code", 404)
    }
    discountAmount = coupon.amount

    const productIds = orderItems.map(item => item.productId)
    const product = await Product.find({ _id: productIds.toString() })

    const subtotal = product.reduce((prev, curr) => {
        const item = orderItems.find(item => item.productId === curr._id.toString())
        if (!item) return prev;
        return curr.price * item.quantity + prev
    }, 0)

    const tax = subtotal * 0.18
    const shippingCharges = subtotal > 1000 ? 0 : 200
    const total = subtotal + tax + shippingCharges - discountAmount

    const paymentIntent = await stripe.paymentIntents.create(
        {
            amount: total * 100,
            currency: "inr",
            description: "ecommmerce website",
            shipping: {
                name: user?.userName as string,
                address: {
                    line1: shoppingInfo.address,
                    postal_code: shoppingInfo.pinCode.toString(),
                    city: shoppingInfo.city,
                    state: shoppingInfo.state,
                    country: shoppingInfo.country
                }
            }
        }
    )
    return res
        .status(200)
        .json(
            {
                message: "payment intent created successfully!",
                success: true,
                clientSecret: paymentIntent.client_secret
            }
        )

})

export const createCoupon = AsyncHandler(async (req: Request, res: Response) => {
    const { code, amount } = req.body

    if (!code || !amount) {
        throw new ApiError("enter code and amount ", 402)
    }
    const newCoupon = await Coupon.create({
        code: code,
        amount: amount
    })
    if (!newCoupon) {
        throw new ApiError("coupon not generated!", 402)
    }
    return res
        .status(200)
        .json(
            {
                message: "coupon generated successfully!",
                success: true,
                newCoupon
            }
        )
})

export const deleteCoupon = AsyncHandler(async (req: Request, res: Response) => {
    const id = req.params
    if (!id) {
        throw new ApiError("please provide coupon id!", 402)
    }
    await Coupon.findByIdAndDelete(id)
    return res
        .status(200)
        .json(
            {
                message: "coupon deleted successfully!",
                success: true,
            }
        )
})

export const getCoupon = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
        throw new ApiError("please provide coupon id!", 402)
    }
    const coupon = await Coupon.findOne({ _id: id.toString() })
    if (!coupon) {
        throw new ApiError("coupon not found!", 404)
    }
    return res
        .status(200)
        .json(
            {
                message: "coupon deleted successfully!",
                success: true,
                coupon
            }
        )
})
 
export const allCoupon = AsyncHandler( async (req:Request,res:Response)=>{
    const allCoupon = await Coupon.find({})
    return res
    .status(200)
    .json(
        {
            message:"all coupons!",
            success:true,
            allCoupon
        }
    )
})

export const applyDiscount = AsyncHandler ( async (req:Request,res:Response)=>{
    const {code} = req.query
    if(!code){
        throw new ApiError("please provide coupon code", 402)
    }
    const coupon = await Coupon.findOne({code:code})
    if(!coupon){
        throw new ApiError("coupon not found", 404)
    }
    return res
    .status(200)
    .json(
        {
            message:"coupon obtained successfully!",
            success:true,
            discount:coupon.amount
        }
    )
})
