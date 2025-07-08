import AsyncHandler from "../utils/asyncHandler";
import { Response, Request } from "express";
import ApiError from "../utils/errorHanlder";
import { OrderItemType, shippingInfoType } from "../types/order";
import { User } from "../models/user.model";
import { Coupon } from "../models/coupon.model";
import { Product } from "../models/product.model";
import { stripe } from "../app";

export const createPaymentIntent = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError("Please login~", 402);
    }
    const user = await User.findById(userId);
    const {
        shoppingInfo,
        orderItems,
        code
    }: {
        shoppingInfo: shippingInfoType;
        orderItems: OrderItemType[];
        code: string;
    } = req.body;

    if (!orderItems) {
        throw new ApiError("Please enter items", 404);
    }
    if (!shoppingInfo) {
        throw new ApiError("Please enter shopping info", 404);
    }
    let discountAmount = 0;
    const coupon = await Coupon.findOne({ code: code });
    if (!coupon) {
        throw new ApiError("Invalid coupon code", 404);
    }
    discountAmount = coupon.amount;

    const productIds = orderItems.map(item => item.productId);
    const product = await Product.find({ _id: productIds.toString() });
    if(product.length === 0){
        throw new ApiError("there is not such products!",404)
    }

    const subtotal = product.reduce((prev, curr) => {
        const item = orderItems.find(item => item.productId === curr._id.toString());
        if (!item) return prev;
        return curr.price * item.quantity + prev;
    }, 0);

    const tax = subtotal * 0.18;
    const shippingCharges = subtotal > 1000 ? 0 : 200;
    const total = subtotal + tax + shippingCharges - discountAmount;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: "inr",
        description: "ecommerce website",
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
    });

    await Product.findByIdAndUpdate(
        productIds,
        {
            $inc: {
                stock: -1
            }
        },
        {
            new: true
        }
    );

    return res.status(200).json({
        message: "Payment intent created successfully!",
        success: true,
        clientSecret: paymentIntent.client_secret
    });
});

export const createCoupon = AsyncHandler(async (req: Request, res: Response) => {
    const { code, amount } = req.body;

    if (!code || !amount) {
        throw new ApiError("Enter code and amount", 402);
    }
    const newCoupon = await Coupon.create({
        code: code,
        amount: amount
    });
    if (!newCoupon) {
        throw new ApiError("Coupon not generated!", 402);
    }

    return res.status(200).json({
        message: "Coupon generated successfully!",
        success: true,
        newCoupon
    });
});

export const deleteCoupon = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Please provide coupon ID!", 402);
    }
    await Coupon.findByIdAndDelete(id);

    return res.status(200).json({
        message: "Coupon deleted successfully!",
        success: true
    });
});

export const getCoupon = AsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError("Please provide coupon ID!", 402);
    }

    const coupon = await Coupon.findOne({ _id: id.toString() });
    if (!coupon) {
        throw new ApiError("Coupon not found!", 404);
    }

    return res.status(200).json({
        message: "Coupon obtained successfully!",
        success: true,
        coupon
    });
});

export const allCoupon = AsyncHandler(async (req: Request, res: Response) => {
    const allCoupons = await Coupon.find({});
    return res.status(200).json({
        message: "All coupons!",
        success: true,
        allCoupons
    });
});

export const applyDiscount = AsyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) {
        throw new ApiError("Please provide coupon code", 402);
    }
    const coupon = await Coupon.findOne({ code: code });
    if (!coupon) {
        throw new ApiError("Coupon not found", 404);
    }
    return res.status(200).json({
        message: "Coupon obtained successfully!",
        success: true,
        discount: coupon.amount
    });
});