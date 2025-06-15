import { Request, Response } from "express"
import AsyncHandler from "../utils/asyncHandler"
import { newProductTypes } from "../types/product"
import ApiError from "../utils/errorHanlder"
import { Product } from "../models/product.model"
import imageKit from "../utils/imageKit"
import fs from "fs"

export const newProduct = AsyncHandler(async(req:Request<{},{},newProductTypes>,res:Response)=>{
    console.log("req.body",req.body)
        const {name,stock,description,price,ratings,numberOfRating,category} = req.body

        const photo = req.file
        
        if (!name || !stock || !description || !price  || !category || !photo) {
          throw new ApiError("All fields are required", 400);
        }
        const uploadedPhoto = await imageKit.upload({
            file:fs.readFileSync(photo.path),
            fileName:photo.originalname
        })
        if(!uploadedPhoto){
            throw new ApiError("photo not uploaded on the imagekit",401)
        }
        try {
            const newProduct = await Product.create({
                name,
                stock,
                description,
                price,
                ratings,
                numberOfRating,
                category,
                photo:uploadedPhoto.url
            })
            return res
            .status(200)
            .json({
                message:"new product created successfully ",
                success:true,
                newProduct
            })
        } catch (error) {
            console.error("failed to create new product",error)
            throw new ApiError("failed to create new product",500)
        }
    })

export const updateProduct = AsyncHandler( async(req:Request,res:Response)=>{
    const {name, stock, description, price, category} = req.body
    const photo = req.file
    const productId = req.params.id

    if(!productId){
        throw new ApiError("Product ID is required", 400)
    }

    const existingProduct = await Product.findById(productId)
    if(!existingProduct){
        throw new ApiError("Product not found", 404)
    }

    // If new photo is provided, handle photo update
    if(photo){
        // Delete old photo from ImageKit
        const oldPhotoUrl = existingProduct.photo
        if(oldPhotoUrl){
            try {
                const urlParts = oldPhotoUrl.split('/')
                const fileName = urlParts[urlParts.length - 1]
                const fileId = fileName.split('.')[0]
                
                if(fileId){
                    await imageKit.deleteFile(fileId)
                    console.log("Successfully deleted old photo with ID:", fileId)
                }
            } catch (error) {
                console.log("Error deleting old photo:", error)
            }
        }

        // Upload new photo
        const uploadedPhoto = await imageKit.upload({
            file: fs.readFileSync(photo.path),
            fileName: photo.originalname
        })

        if(!uploadedPhoto){
            throw new ApiError("Failed to upload new photo", 500)
        }

        // Update product with new photo
        existingProduct.photo = uploadedPhoto.url
    }

    // Update other fields if provided
    if(name) existingProduct.name = name
    if(stock) existingProduct.stock = stock
    if(description) existingProduct.description = description
    if(price) existingProduct.price = price
    if(category) existingProduct.category = category

    // Save the updated product
    await existingProduct.save()

    return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        updatedProduct: existingProduct
    })
})
export const deleteProduct = AsyncHandler(async(
    req:Request,
    res:Response
) => {
    const productId = req.params.id

    if(!productId){
        throw new ApiError("Product ID is required", 400)
    }

    const existingProduct = await Product.findById(productId)
    if(!existingProduct){
        throw new ApiError("Product not found", 404)
    }

    // Delete photo from ImageKit
    const photoUrl = existingProduct.photo
    if(photoUrl){
        try {
            const urlParts = photoUrl.split('/')
            const fileName = urlParts[urlParts.length - 1]
            const fileId = fileName.split('.')[0]
            
            if(fileId){
                await imageKit.deleteFile(fileId)
            }
        } catch (error) {
            console.log("Error deleting photo:", error)
        }
    }

    // Delete product from database
    await Product.findByIdAndDelete(productId)

    return res.status(200).json({
        message: "Product deleted successfully",
        success: true
    })
})