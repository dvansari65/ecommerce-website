import AsyncHandler from "../utils/asyncHandler";
import { Response, Request } from "express";
import ApiError from "../utils/errorHanlder";
import { OrderItemType, shippingInfoType } from "../types/order";
import { User } from "../models/user.model";
import { Coupon } from "../models/coupon.model";
import { Product } from "../models/product.model";
import { stripe } from "../app";
import { Cart } from "../models/addToCart";
import { cartResponse } from "../types/product";
import { invalidateKeys } from "../utils/invalidateCache";

export const createPaymentIntentFromCart = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError("Please login~", 402);
    }

    const cart = await Cart.findOne({ user: userId })
        .populate("items.productId") as unknown as cartResponse;


    const CartProductIds = cart?.items.map(i => i.productId)
    const product = await Product.find({ _id: { $in: CartProductIds } })
    const user = await User.findById(userId);
    let CouponMessage = "";

    const {
        shippingInfo,
    }: {
        shippingInfo: shippingInfoType;
    } = req.body;

    const { code } = req.query

    if (!shippingInfo) {
        throw new ApiError("Please enter shopping info", 404);
    }
    let discountAmount = 0;
    let coupon = null;

    if (code ) {
        coupon = await Coupon.findOne({ code: code });
        if (!coupon) {
            console.log("Coupon not found!");
            CouponMessage = "Coupon not applied: Code not found.";
        } 
        if(coupon) {
            console.log("Coupon found:", coupon);
            CouponMessage = "Coupon applied successfully.";
        }
    }

    discountAmount = typeof coupon?.amount === "number" ? coupon.amount : 0;

    const subtotal = cart?.items.reduce((total, curr) => {
        const productToBeBuy = product.some(i => i._id.toString() === curr.productId._id.toString())
        if (!productToBeBuy) throw new ApiError("Product mismatch", 500);
        const price = curr.productId.discount && curr.productId.discount > 0
            ? curr.productId.price - (curr.productId.price * curr.productId.discount) / 100
            : curr.productId.price;
        const quantity = curr.quantity
        return total += price * quantity
    }, 0);

    const tax = Math.round(subtotal * 0.18);
    const shippingCharges = subtotal > 1000 ? 0 : 200;
    const total = Math.round(subtotal + tax + shippingCharges - discountAmount) ;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: "inr",
        description: "ecommerce website",
        shipping: {
            name: user?.userName as string,
            address: {
                line1: shippingInfo.address,
                postal_code: shippingInfo.pinCode.toString(),
                city: shippingInfo.city,
                state: shippingInfo.state,
                country: shippingInfo.country
            }
        }
    });


    await Promise.all(
        cart.items.map(i =>
            Product.findByIdAndUpdate(
                i.productId._id,
                { $inc: { stock: -i.quantity } },
                { new: true }
            )
        )
    );

    await invalidateKeys({ product: true, cart: true, admin: true })
    return res.status(200).json({
        message: "payment created successfully!",
        success: true,
        clientSecret: paymentIntent.client_secret,
        cart,
        subtotal,
        tax,
        total,
        discount: discountAmount,
        shippingCharges,
        CouponMessage
    });
});


export const createPaymentIntentDirectly = AsyncHandler(async (
    req: Request<
        {},
        {},
        {
            shippingInfo: shippingInfoType,
            orderItems: OrderItemType[],
        },
        { code: string }
    >, res: Response) => {

    const userId = req.user?._id

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError("user not found!", 404)
    }
    const {
        shippingInfo,
        orderItems,
    }:
    {
        shippingInfo: shippingInfoType,
        orderItems: OrderItemType[],

    } = req.body
    const { code } = req.query
    
    const productId = orderItems.map(i => i.productId)
    const products = await Product.find({ _id: { $in: productId } })
    
    for (const product of products) {
        const item = orderItems.find(i => i.productId.toString() === product._id.toString());
        if (!item) continue;
      
        if (item.quantity >= product.stock) {
          return res.status(400).json({
            message: "You have to minimise your product's quantity!",
            success: false,
          });
        }
      }

    const subtotal = products.reduce((total, cur) => {
        const item = orderItems.find(i => i.productId.toString() === cur._id.toString())
        if (!item) return total
        const price = cur.discount && cur.discount > 0
            ? cur.price - (cur.price * cur.discount) / 100
            : cur.price;
        return total + price * item.quantity;
    }, 0)

    
    let coupon = null
    let CouponMessage = ""
    if (code ) {
        coupon = await Coupon.findOne({ code: code });
        if (!coupon) {
            console.log("Coupon not found!");
            CouponMessage = "Coupon not applied: Code not found.";
        } 
        if(coupon) {
            console.log("Coupon found:", coupon);
            CouponMessage = "Coupon applied successfully.";
        }
    }
    const discount = coupon?.amount ?? 0
    const tax = Math.round( subtotal * 0.18)
    const shippingCharges = subtotal  > 1000 ? 0 : 200
    const rawTotal = Math.round(subtotal  + tax + shippingCharges - discount);

    const amount = Math.round(rawTotal * 100); // Stripe expects paise

    let paymentIntent;
    try {
         paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "inr",
            description: "MERN-Ecommerce",
            shipping: {
                name: user.userName as string,
                address: {
                    line1: shippingInfo.address,
                    postal_code: shippingInfo.pinCode.toString(),
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    country: shippingInfo.country,
                },
            },
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        throw new ApiError("Failed to create Stripe payment intent", 500);
    }

    await invalidateKeys({ product: true, admin: true })
    return res.status(200).json({
        message: "payment created successfully!",
        success: true,
        clientSecret:paymentIntent.client_secret,
        CouponMessage,
        tax,
        total:rawTotal,
        shippingCharges,
        discount,
        subtotal,  
        products
    })
})

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
    await Coupon.findByIdAndDelete(id.toString());

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
        return res.status(404).json({
            message: "coupon not found!",
            success: false
        })
    }
    return res.status(200).json({
        message: "Coupon obtained successfully!",
        success: true,
        discount: coupon
    });
});