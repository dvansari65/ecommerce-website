import { Request, Response } from "express";
import { Cart } from "../models/addToCart";
import { addCartType, productIdType } from "../types/types";
import AsyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/errorHanlder";
import redis from "../utils/redis";
import { addCacheKey, invalidateKeys } from "../utils/invalidateCache";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { cartResponse } from "../types/product";


// while creatign the cart default qauntity should be 1 and there will be two funcitons will increase and decrease
// the quantity of the product
export const createCart = AsyncHandler(async (req: Request<productIdType, {}, {}>, res: Response) => {
    const { productId } = req.params
    if (!productId) {
        throw new ApiError("please provide product ID ", 400)
    }
    const userId = req.user?._id
    
    const cart = await Cart.findOne({ user: userId })

    console.log("first cart:", cart)
    if (cart) {
        const oneItem = cart?.items?.find(i => i.productId?.toString() === productId)
        console.log("one item:", oneItem)
        if (oneItem) {
            return res.status(200).json({
                message: "product already added to the cart!",
                success: false
            })
        } else {
            cart.items.push({
                productId
            })
            await cart.save()
            invalidateKeys({ cart: true })
            console.log("cart:", cart)
            return res.status(200).json({
                message: "product successfully added to the cart!",
                success: true
            })
        }
    } else {
        const cart = await Cart.create({
            user: userId,
            items: [
                {
                    productId: productId,
                }
            ]
        })
        invalidateKeys({ cart: true })
        console.log("new cart:", cart)
        return res.status(200).json({
            message: "cart successfully created !",
            success: true
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
    await invalidateKeys({ cart: true })
    return res.status(200).json({
        message: "cart successfully deleted!",
        success: true
    })

})
export const decreaseProductQuantity = AsyncHandler(async (req: Request<productIdType>, res: Response) => {
    const userId = req.user?._id as string
    const { productId } = req.params

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
    if (item.quantity === 1) {
        return res.status(200).json({
            message: "can not decrease the quantity less than 1!",
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
    await invalidateKeys({cart:true})
    return res.status(200).json({
        message: "Product quantity updated!",
        success: true,
        quantity: item.quantity
    })
})

export const increaseQuantity = AsyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const userId = req.user?._id
    if (!productId) {
        throw new ApiError('please provide product ID', 400)
    }
    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError("product not found!", 404)
    }
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
        return res.status(404).json({
            message: "cart not found!",
            success: true
        })
    }
    const item = cart.items.find(i => i.productId?.toString() === productId)
    if (!item) {
        throw new ApiError("item not found!", 404)
    }
    if (item.quantity >= product.stock) {
        return res.status(200).json({
            message: "product is out of stock!",
            success: false
        })
    }
    const updatedCart = await Cart.findOneAndUpdate(
        {
            user: userId,
            "items.productId": productId
        },
        {
            $inc: {
                "items.$.quantity": 1
            }
        },
        {
            new: true
        }
    )
    if (!updatedCart) {
        throw new ApiError("cart can not be update", 500)
    }
    const updatedItem = updatedCart.items.find(i => i.productId?.toString() === productId);
    await invalidateKeys({cart:true})
    return res.status(200).json({
        message: "quantity increased!",
        success: true,
        quantity: updatedItem?.quantity
    })
})

export const getAllCartProducts = AsyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) {
        throw new ApiError("please provide user ID! ", 400)
    }
    const key = `all-cart-products-${userId}`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "all cart products fetched successfully!",
            success: true,
            products: JSON.parse(cachedData)
        })
    }
    const cart = await Cart.findOne({
        user: userId

    }).populate("items.productId")
    if (!cart || cart == null) {
        return res.status(200).json({
            message: "cart not found!",
            success: false
        })
    }
    const products = cart.items.map(i => i)
    console.log('product:', products)
    if (products.length === 0) {
        return res.status(200).json({
            message: "your product cart is empty !",
            success: false,

        })

    }
    await redis.set(key, JSON.stringify(products))
    await addCacheKey(key)
    return res.status(200).json({
        message: "your product cart fetched !",
        success: true,
        products
    })

})

export const getAllCarts = AsyncHandler(async (req: Request, res: Response) => {
    const key = `all-carts`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "all carts fetched successfully!",
            success: true,
            carts: JSON.parse(cachedData)
        })
    }
    const carts = await Cart.find({})
    await redis.set(key, JSON.stringify(carts))
    await addCacheKey(key)
    return res.status(200).json({
        message: "all cart successfully fetched!",
        success: true,
        carts
    })
})

export const getSingleProductFromCart = AsyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params
    const userId = req.user?._id as string
    if (!productId) {
        throw new ApiError("please provide product ID", 400)
    }
    const key = `single-cart-product-${productId}`
    const cachedData = await redis.get(key)
    if (cachedData) {
        return res.status(200).json({
            message: "single product got successfully!",
            success: true,
            product: JSON.parse(cachedData)
        })
    }
    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
        throw new ApiError("cart not found!", 404)
    }
    const existingProduct = cart.items.find(i => i.productId?.toString() === productId)
    // console.log("existingProduct",existingProduct)
    if (!existingProduct) {
        return res.status(500).json({
            message: "product not found!",
            success: false
        })
    }
    await redis.set(key, JSON.stringify(existingProduct))
    await addCacheKey(key)
    return res.status(500).json({
        message: "product  found!",
        success: true,
        product: existingProduct
    })

})


export const deleteProductFromCart = AsyncHandler( async( req:Request,res:Response)=>{
    const {productId} = req.params
    const userId = req.user?._id
    if(!productId){
        throw new ApiError("please provide product ID!",400)
    }
    const cart = await Cart.findOne({user:userId})
    if(!cart){
       return res.status(404).json({
            message:"cart not found!",
            success:false
       })
    }
    const product = cart.items.find(i=> i.productId?.toString() === productId)
    console.log("product:",product)
    if(!product){
        return res.status(200).json({
            message:"product not found!",
            success:false
        })
    }
    cart.items.pull(product?._id)
    console.log("product:",product._id)
    await cart.save()
    await invalidateKeys({cart:true})
    return res.status(200).json({
        message:"product deleted !",
        success:true
    })

})

export const cartDetails = AsyncHandler(async (req:Request,res:Response)=>{
    const userId = req.user?._id
    if(!userId){
        throw new ApiError("please login first!",401)
    }
    const user  = await User.findById(userId)
    if(!user){
        return res.status(404).json({
            message:"user not found!",
            success:true,
        })
    }
    const cart = await Cart.findOne({ user: userId })
    .populate("items.productId") as unknown as cartResponse;
    if(!cart){
        throw new ApiError("cart not found!",404)
    }
    const CartProductIds = cart.items.map(i => i.productId)
    const product = await Product.find({ _id: { $in: CartProductIds } })
    const subtotal = cart?.items.reduce((total, curr) => {
        const productToBeBuy = product.some(i => i._id.toString() === curr.productId._id.toString())
        if (!productToBeBuy) throw new ApiError("Product mismatch", 500);
        const price = curr.productId.discount && curr.productId.discount > 0
            ? curr.productId.price - (curr.productId.price * curr.productId.discount) / 100
            : curr.productId.price;
        const quantity = curr.quantity
        return total += price * quantity
    }, 0);
    const tax = subtotal * 0.18;
    const shippingCharges = subtotal > 1000 ? 0 : 200;
    return res.status(200).json({
        message:"cart detailes fetched successfully!",
        success:true,
        cartDetails:{
            subtotal,
            tax,
            shippingCharges
        }
    })

})
