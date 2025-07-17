import { NextFunction, Request, Response } from "express";
import AsyncHandler from "../utils/asyncHandler";
import { newProductTypes, updateProductProps } from "../types/product";
import ApiError from "../utils/errorHanlder";
import { Product } from "../models/product.model";
import imageKit from "../utils/imageKit";
import fs from "fs";
import { baseQuery, searchQuery } from "../types/types";
import redisClient from "../utils/redis";
import { invalidateKeys } from "../utils/invalidateCache";
import { addCacheKey } from "../utils/invalidateCache";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";

export const newProduct = AsyncHandler(
  async (req: Request<{}, {}, newProductTypes>, res: Response) => {
    const {
      name,
      stock,
      description,
      price,
      ratings,
      numberOfRating,
      category,
    } = req.body;
    const photo = req.file;

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
      fileName: photo.originalname,
    });
    if (!uploadedPhoto) {
      throw new ApiError("Photo not uploaded on the imagekit", 401);
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
        photo: uploadedPhoto.url,
      });
      const productCount = await Product.countDocuments();
      await invalidateKeys({ product: true, admin: true }!);
      return res.status(200).json({
        message: "New product created successfully",
        success: true,
        newProduct,
        productCount,
      });
    } catch (error) {
      console.error("Failed to create new product", error);
      throw new ApiError("Failed to create new product", 500);
    }
  }
);

export const updateProduct = AsyncHandler(
  async (
    req: Request<{ id: string }, {}, updateProductProps>,
    res: Response
  ) => {
    const { name, stock, description, price, category } = req.body;
    const photo = req.file;
    const id = req.params.id;

    if (!id) {
      throw new ApiError("Product ID is required", 400);
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new ApiError("Product not found", 404);
    }

    if (photo) {
      const oldPhotoUrl = existingProduct.photo;
      if (oldPhotoUrl) {
        try {
          const urlParts = oldPhotoUrl.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const fileId = fileName.split(".")[0];

          if (fileId) {
            await imageKit.deleteFile(fileId);
            console.log("Successfully deleted old photo with ID:", fileId);
          }
        } catch (error) {
          console.log("Error deleting old photo:", error);
        }
      }

      const uploadedPhoto = await imageKit.upload({
        file: fs.readFileSync(photo.path),
        fileName: photo.originalname,
      });

      if (!uploadedPhoto) {
        throw new ApiError("Failed to upload new photo", 500);
      }

      existingProduct.photo = uploadedPhoto.url;
    }

    if (name) existingProduct.name = name;
    if (stock) existingProduct.stock = stock;
    if (description) existingProduct.description = description;
    if (price) existingProduct.price = price;
    if (category) existingProduct.category = category;

    await existingProduct.save();
    await invalidateKeys({ product: true, admin: true });
    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      updatedProduct: existingProduct,
    });
  }
);

export const deleteProduct = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("Product ID is required", 400);
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new ApiError("Product not found", 404);
    }

    const photoUrl = existingProduct.photo;
    if (photoUrl) {
      try {
        const urlParts = photoUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const fileId = fileName.split(".")[0];

        if (fileId) {
          await imageKit.deleteFile(fileId);
        }
      } catch (error) {
        console.log("Error deleting photo:", error);
      }
    }

    await Product.findByIdAndDelete(id);
    await Order.findByIdAndDelete(id);

    // Invalidate related cache keys
    await invalidateKeys({ product: true, admin: true, order: true });

    const stockCount = await Product.countDocuments();

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      stockCount,
    });
  }
);

export const filterProduct = AsyncHandler(
  async (req: Request<{}, {}, {}, searchQuery>, res: Response) => {
    const { category, price, search, sort } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PAGE_LIMIT) || 8;
    const skip = (page - 1) * limit;
    const key = `filter-products-${page}-${limit}-${category}-${price}-${search}-${sort}`;

    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return res.status(200).json({
        message: "data fetched successfully!",
        success: true,
        products: JSON.parse(cachedData),
      });
    }

    const basequery: baseQuery = {};

    if (category && typeof category === "string") basequery.category = category;

    if (price && !isNaN(Number(price))) {
      basequery.price = {
        $lte: Number(price),
      };
    }

    if (search && typeof search === "string") {
      basequery.name = {
        $regex: search,
        $options: "i",
      };
    }

    let sortOptions: any = {};
    if (sort === "asc") {
      sortOptions.price = 1;
    } else if (sort === "dsc") {
      sortOptions.price = -1;
    }

    const [products, totalCount] = await Promise.all([
      Product.find(basequery).sort(sortOptions).skip(skip).limit(limit),
      Product.countDocuments(basequery),
    ]);

    const totalPage = Math.ceil(totalCount / limit);
    
    await redisClient.set(key, JSON.stringify(products));
    await addCacheKey(key);

    return res.status(200).json({
        message: "Filtered successfully",
        success: true,
        totalPage,
        products
    });
  }
);

export const getAllAdminProducts = AsyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PAGE_LIMIT) || 8;
    const skip = (page - 1) * limit;
    const key = `all-products-page-${page}-limit-${limit}`;

    // Check if the products are cached in Redis
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      const { products, totalPages } = JSON.parse(cachedData);
      return res.status(200).json({
        message: "Products fetched successfully (from cache)",
        success: true,
        currentPage: page,
        products,
        totalPages,
      });
    }

    // Fetch products and total count from the database if not cached
    const [products, totalProducts] = await Promise.all([
      Product.find().limit(limit).skip(skip).sort({ createdAt: -1 }),
      Product.countDocuments(),
    ]);
    const totalPages = Math.ceil(totalProducts / limit);

    // Cache the fetched data in Redis
    await redisClient.set(
      key,
      JSON.stringify({ products, totalPages }),
      "EX",
      3600 // Cache for 1 hour
    );
    await addCacheKey(key);
    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      currentPage: page,
      products,
      totalPages,
    });
  }
);

export const getAllCategories = AsyncHandler(
  async (req: Request, res: Response) => {
    // Check if the categories are cached in Redis
    const key = `products-categories`;
    const cachedCategories = await redisClient.get(key);
    if (cachedCategories) {
      return res.status(200).json({
        message: "All products obtained by their categories (from cache)!",
        success: true,
        products: JSON.parse(cachedCategories),
      });
    }

    // Fetch categories from the database if not cached
    const productsByCategories = await Product.distinct("category");

    if (productsByCategories.length === 0) {
      return res.status(200).json({
        message: "No products found",
        success: true,
      });
    }

    // Cache the categories in Redis
    await redisClient.set(
      key,
      JSON.stringify(productsByCategories),
      "EX",
      3600
    ); // Cache for 1 hour
    await addCacheKey(key);
    return res.status(200).json({
      message: "All products obtained by their categories!",
      success: true,
      products: productsByCategories,
    });
  }
);

export const getSingleProduct = AsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const key = `product-${id}`;
    const userId = req?.user?._id;
    if (!userId) {
      throw new ApiError("user is not logged in !", 400);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("user not found!", 404);
    }
    // Check if the product is cached in Redis
    const cachedProduct = await redisClient.get(key);
    if (cachedProduct) {
      return res.status(200).json({
        message: "Product obtained successfully (from cache)",
        success: true,
        product: JSON.parse(cachedProduct),
      });
    }

    // Fetch product from the database if not cached
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError("Product not found!", 404);
    }

    // Cache the product in Redis
    await redisClient.set(key, JSON.stringify(product), "EX", 3600); // Cache for 1 hour
    await addCacheKey(key);
    return res.status(200).json({
      message: "Product obtained successfully",
      success: true,
      product,
    });
  }
);

export const deleteAllProducts = AsyncHandler(
  async (req: Request, res: Response) => {
    await Product.deleteMany({});
    invalidateKeys({ product: true, order: true, review: true, cart: true });
    return res.status(200).json({
      message: "all products deleted successfully!",
      success: true,
    });
  }
);

export const getAllLatestProduct = AsyncHandler(
  async (req: Request, res: Response) => {
    const key = `latest-product`;
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.status(200).json({
        message: "your latest products!",
        success: true,
        products: JSON.parse(cachedData),
      });
    }
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
    await redisClient.set(key, JSON.stringify(products));
    addCacheKey(key);
    return res.status(200).json({
      message: "your latest products!",
      success: true,
      products,
    });
  }
);
