import { newUserTypes } from "./user";

export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    description?: string;
    ratings?: number;
    photo: string;
    numberOfRatings?: number;
    discount?: number;
    discountedPrice?: number;
    createdAt?: string;
    updatedAt?: string;
    onClick?: () => void;
    onWishlistClick?: () => void;
}

export interface newProductTypes {
    name: string,
    category: string,
    stock: number,
    price: number,
    description: string,
    ratings: number,
    numberOfRating: number
}

export interface updateProductProps {
    name: string,
    stock: number,
    description: string,
    price: number,
    category: string
}

export type cartItem = {
    productId: Product,
    quantity: number,
    _id: string
}

export interface cartResponse {
    user: newUserTypes,
    items: cartItem[],
    createdAt?: string;
    updatedAt?: string;
}