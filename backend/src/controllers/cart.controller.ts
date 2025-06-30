import { Request, Response } from "express";
import { Cart } from "../models/addToCart";
import { addCartType, productIdType } from "../types/types";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";



export const createCart = AsyncHandler(async (req: Request<productIdType, {}, addCartType>, res: Response) => {
    const { quantity } = req.body
    const { productId } = req.params
    const userId = req.user?._id
    if (!productId || productId === "undefined") {
        throw new ApiError("please enter id !", 402)
    }
    
    let cart = await Cart.findOne({user:userId})
    console.log("cart:",cart)
    if(cart){
        let item = cart.items.find(i=>i.productId?.toString() == productId )
        if(item || item != null) {
            item.quantity += quantity
        }else{
            cart?.items?.push({quantity,productId})
        }
        await cart.save()
        return res.status(200).json({
            message:"cart created successfully!",
            success:true,
            cart
        })
    }
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
        message:"cart created successfully!",
        success:true,
        cart
  
})
})

