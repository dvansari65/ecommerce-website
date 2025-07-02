import { Request, Response } from "express";
import { Cart } from "../models/addToCart";
import { addCartType, productIdType } from "../types/types";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import redis from "../utils/redis";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";


// while creatign the cart default qauntity should be 1 and there will be two funcitons will increase and decrease
// the quantity of the product
export const createCart = AsyncHandler(async (req: Request<productIdType, {}, {}>, res: Response) => {
    const { productId } = req.params
    const userId = req.user?._id
    if (!productId || productId === "undefined") {
        throw new ApiError("please enter id !", 402)
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.productId")
   
    console.log("cart:", cart)
    if (cart) {
        console.log("cart@:", cart)
        let item = cart.items.find(i => i.productId?.toString() == productId)
        
        if (item?.productId) {
            item.quantity
        } else {
            cart?.items?.push({, productId })
        }
        await cart.save()
        invalidateKeys({ cart: true })
        return res.status(200).json({
            message: "cart created successfully!",
            success: true,
            cart
        })
    } else {
        let cart = await Cart.create({
            user: userId,
            items: [{ productId, quantity }],
        });

        const populatedCart = await Cart.findById(cart._id).populate("items.productId");
        if (!populatedCart) {
            throw new ApiError("cart not found", 400)
        }
        invalidateKeys({ cart: true })
        return res.status(200).json({
            message: "cart created successfully!",
            success: true,
            cart: populatedCart
        })
    }
})

export const deleteCart = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) {
        return res.status(200).json({
            message: "please provide user id!",
            success: true
        })
    }
    const existingCart = await Cart.findOne({ user: userId })
    console.log("cart:", existingCart)
    if (!existingCart) {
        throw new ApiError("cart not found!", 400)
    }
    await Cart.findByIdAndDelete(existingCart._id)
    invalidateKeys({ cart: true })
    return res.status(200).json({
        message: "cart successfully deleted!",
        success: true
    })

})
export const decreaseProductQuantity = AsyncHandler(async (req: Request<productIdType>, res: Response) => {
    const userId = req.user?._id as string
    const productId = req.params.productId

    if (!userId || !productId || productId === "undefined") {
        throw new ApiError("Please provide a valid user ID and product ID!", 400)
    }

    const cart = await Cart.findOne({ user: userId })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found!",
            success: false
        })
    }

    const item = cart.items.find(i => i.productId?.toString() === productId)

    if (!item) {
        return res.status(404).json({
            message: "Product not found in cart!",
            success: false
        })
    }

    if (item.quantity > 1) {
        item.quantity -= 1
    } else {
        const index = cart.items.findIndex(i => i.productId?.toString() === productId)
        if (index > -1) {
            cart.items.splice(index, 1)
        }
    }

    await cart.save()
    invalidateKeys({ cart: true })
    return res.status(200).json({
        message: "Product quantity updated!",
        success: true,
        cart
    })
})

export const getAllCartProducts = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) {
        throw new ApiError("please provide user ID! ", 400)
    }
    const key = `all-cart-products`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "all cart products fetched successfully!",
            success: true,
            product: JSON.parse(cachedData)
        })
    }
    const cart = await Cart.findOne({ user: userId }).populate("items.productId")
    if (!cart || cart == null) {
        return res.status(200).json({
            message: "cart not found!",
            success: true
        })
    }
    const product = cart.items.map(i => i)
    if (product.length === 0) {
        return res.status(200).json({
            message: "your product cart is empty !",
            success: false,

        })

    }
    await redis.set(key, JSON.stringify(product))
    await addCacheKey(key)
    return res.status(200).json({
        message: "your product cart fetched !",
        success: true,
        product
    })

})
