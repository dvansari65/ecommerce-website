import { Request, Response } from "express";
import { Cart } from "../models/addToCart";
import { addCartType, productIdType, ReqUser } from "../types/types";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import { User } from "../models/user.model";



export const createCart = AsyncHandler(async (req: Request<productIdType, {}, addCartType>, res: Response) => {
    const { quantity } = req.body
    const { productId } = req.params
    const userId = req.user?._id
    if (!productId || productId === "undefined") {
        throw new ApiError("please enter id !", 402)
    }

    let cart = await Cart.findOne({ user: userId })
    console.log("cart:", cart)
    if (cart) {
        let item = cart.items.find(i => i.productId?.toString() == productId)
        if (item || item != null) {
            item.quantity += quantity
        } else {
            cart?.items?.push({ quantity, productId })
        }
        await cart.save()
        return res.status(200).json({
            message: "cart created successfully!",
            success: true,
            cart
        })
    } else {
        cart = await Cart.create({
            user: userId,
            items: [
                {
                    productId,
                    quantity,
                },
            ],
        });
        return res.status(200).json({
            message: "cart created successfully!",
            success: true,
            cart

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
    await Cart.findByIdAndDelete({ user: userId })
    return res.status(200).json({
        message: "cart successfully deleted!",
        success: true
    })

})
export const decreaseProductQuantity = AsyncHandler(async (req: Request<productIdType>, res: Response) => {
    const userId = req.user?._id as string
    const productId = req.params
    if (!userId || !productId || productId.productId === "undefined") {
        throw new ApiError("please provide user id and productId!", 400)
    }
    let cart = await Cart.findOne({ user: userId })

    if (cart) {
        const item = cart.items.find(i => i.productId?.toString() == productId.productId)
        if (item || item != null) {
            if (item.quantity > 1) {
                item.quantity -= 1
            }
        }
        cart.items.push(item!)
        cart = await cart.save()
        return res.status(200).json({
            message: "quantity decremented!",
            success: true,
            cart
        })
    } else {
        return res.status(200).json({
            message: "there is no such cart!",
            success: false
        })
    }
})

