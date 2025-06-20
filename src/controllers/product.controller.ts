import { NextFunction, Request, Response } from "express"
import AsyncHandler from "../utils/asyncHandler"
import { newProductTypes } from "../types/product"
import ApiError from "../utils/errorHanlder"
import { Product } from "../models/product.model"
import imageKit from "../utils/imageKit"
import fs from "fs"
import { baseQuery } from "../types/types"
import { myCache } from "../app"


import { addCacheKey,  invalidateKeys } from "../utils/invalidateCache"

export const newProduct = AsyncHandler(async (req: Request<{}, {}, newProductTypes>, res: Response) => {
    console.log("req.body", req.body)
    const { name, stock, description, price, ratings, numberOfRating, category } = req.body

    const photo = req.file

    if (!name || !stock || !description || !price || !category || !photo) {
        throw new ApiError("All fields are required", 400);
    }
    if (stock < 0) {
        throw new ApiError("Stock cannot be negative", 400);
    }

    if (price < 0) {
        throw new ApiError("Price cannot be negative", 400);
    }

    if (ratings && (ratings < 0 || ratings > 5)) {
        throw new ApiError("Ratings must be between 0 and 5", 400);
    }

    const uploadedPhoto = await imageKit.upload({
        file: fs.readFileSync(photo.path),
        fileName: photo.originalname
    })
    if (!uploadedPhoto) {
        throw new ApiError("photo not uploaded on the imagekit", 401)
    }
    try {
        const newProduct = await Product.create({
            name,
            stock,
            description,
            price,
            ratings,
            numberOfRating,
            category: category.toLowerCase(),
            photo: uploadedPhoto.url
        })
        const productCount = await Product.countDocuments()
        invalidateKeys({product:true,admin:true})
            

        return res
            .status(200)
            .json({
                message: "new product created successfully ",
                success: true,
                newProduct,
                productCount
            })
    } catch (error) {
        console.error("failed to create new product", error)
        throw new ApiError("failed to create new product", 500)
    }
})

export const updateProduct = AsyncHandler(async (req: Request, res: Response) => {
    const { name, stock, description, price, category } = req.body
    const photo = req.file
    const id = req.params.id

    if (!id) {
        throw new ApiError("Product ID is required", 400)
    }

    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
        throw new ApiError("Product not found", 404)
    }
    if (photo) {
        const oldPhotoUrl = existingProduct.photo
        if (oldPhotoUrl) {
            try {
                const urlParts = oldPhotoUrl.split('/')
                const fileName = urlParts[urlParts.length - 1]
                const fileId = fileName.split('.')[0]

                if (fileId) {
                    await imageKit.deleteFile(fileId)
                    console.log("Successfully deleted old photo with ID:", fileId)
                }
            } catch (error) {
                console.log("Error deleting old photo:", error)
            }
        }

        const uploadedPhoto = await imageKit.upload({
            file: fs.readFileSync(photo.path),
            fileName: photo.originalname
        })

        if (!uploadedPhoto) {
            throw new ApiError("Failed to upload new photo", 500)
        }

        existingProduct.photo = uploadedPhoto.url
    }

    if (name) existingProduct.name = name
    if (stock) existingProduct.stock = stock
    if (description) existingProduct.description = description
    if (price) existingProduct.price = price
    if (category) existingProduct.category = category

    // Save the updated product
    await existingProduct.save()
    invalidateKeys({product:true,admin:true})
    return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        updatedProduct: existingProduct
    })
})

export const deleteProduct = AsyncHandler(async (
    req: Request,
    res: Response
) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError("Product ID is required", 400)
    }

    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
        throw new ApiError("Product not found", 404)
    }


    const photoUrl = existingProduct.photo
    if (photoUrl) {
        try {
            const urlParts = photoUrl.split('/')
            const fileName = urlParts[urlParts.length - 1]
            const fileId = fileName.split('.')[0]

            if (fileId) {
                await imageKit.deleteFile(fileId)
            }
        } catch (error) {
            console.log("Error deleting photo:", error)
        }
    }

    await Product.findByIdAndDelete(id)

    //decrease stock count
    const [minimizeStockAfterDelete, stockCount] = await Promise.all([
        Product.findByIdAndUpdate(
            id,
            {
                $inc: { stock: -1 }
            },
            {
                new: true
            }
        ),
        Product.countDocuments({})
    ])
    invalidateKeys({product:true,admin:true})
    // decrease product stock

    return res.status(200).json({
        message: "Product deleted successfully",
        success: true,
        minimizeStockAfterDelete,
        stockCount
    })
})

export const filterProduct = AsyncHandler(async (req: Request, res: Response) => {
    const { category, price, search, sort } = req.query

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8
    const skip = (page - 1) * limit

    const basequery: baseQuery = {}

    if (category && typeof category === "string") basequery.category = category;

    if (price && !isNaN(Number(price))) basequery.price =
    {
        $lte: Number(price)
    };

    if (search && typeof search === "string") basequery.search =
    {
        $regex: String(search),
        $options: "i"
    };

    let sortOptions: any = {}
    if (sort === "asc") {
        sortOptions.price = 1
    } else {
        sortOptions.price = -1
    }

    const sortedProducts = await Product.find(basequery)
        .sort(sortOptions)
        .limit(limit)
        .skip(skip)

    const [allProducts, filteredOnlyProducts] = await Promise.all([
        sortedProducts,
        Product.find(basequery)
    ])
    const products = allProducts
    const totalPage = Math.ceil(filteredOnlyProducts.length / limit)
    return res
        .status(200)
        .json({
            message: "filtered successfully",
            success: true,
            products,
            totalPage
        })
})

export const getAllAdminProducts = AsyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const key = `all-products-${page}-${limit}`

    if (myCache.has(key)) {
        const cachedProducts = JSON.parse(myCache.get(key) as string)
        return res
            .status(200)
            .json({
                message: "data cached successfully ",
                success: true,
                totalPage: Math.ceil(cachedProducts.length / limit),
                cachedProducts,
                currentPage: page
            })
    }


    const [products, totalProducts] = await Promise.all([
        Product.find()
            .limit(limit)
            .skip(skip).sort({createdAt:-1}),
        Product.countDocuments()
    ]);
    const totalPages = Math.ceil(totalProducts / limit);
    const cacheData = {
        products,
        totalProducts,
        totalPages
    }
    myCache.set(key, JSON.stringify(cacheData))
    addCacheKey(key)
    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        currentPage: page,
        cacheData
    });
});

export const getAllCategories = AsyncHandler(async (req: Request, res: Response) => {
    

    const productsByCategories = await Product.distinct("category").populate("name", "stock")
    if (productsByCategories.length === 0) {
        return res.status(200).json({
            message: "no products found",
            success: true
        })
    }
    return res
        .status(200)
        .json(
            {
                message: "all products obtain by their catogories!",
                success: true,
                productsByCategories
            }
        )
})

export const getSingleProduct = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user?._id
    const { id } = req.params
    const key = `product-${id}`
    let product;
    if (!id) {
        throw new ApiError("please provide product id", 402)
    }
    if (!user) {
        throw new ApiError("unAuthorised request!", 402)
    }
    if (myCache.has(key)) {
        product = JSON.parse(myCache.get(key) as string)
        return res
            .status(200)
            .json({
                message: "product obtain successfully",
                success: true,
                product
            })
    }
    product = await Product.findById(id)
    if (!product) {
        throw new ApiError(" product not found!", 404)
    }
    myCache.set(key, JSON.stringify(product));
    addCacheKey(key)
    return res
        .status(200)
        .json({
            message: "product obtain successfully",
            success: true,
            product
        })

})
