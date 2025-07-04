import type { messageResponse } from "./api-types";

export interface User {
    userName?:string,
    password?:string,
    email?:string,
    dob?:string,
    gender?:"male" | "femal" | "transgender",
    photo?:string,
}

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

export interface Review { 
  _id:string,
  comment:string,
  user:User,
  product:Product,
  createdAt:string,
}

export type refreshDataResponse = {
  success:boolean,
  message:string,
  newAccessToken:string
}
 export type messageAndSuccessProps = {
  message:string ,
  success?:boolean
 }

export type error = {
  message:string,
  statusCode :number
}
export type eachItemType = {
  _id: string;
  productId: string;
  quantity: number;
}

export type createCartType = {
  _id: string;
  user: string;
  items: eachItemType[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartProps {
  message:messageAndSuccessProps,
  success:messageAndSuccessProps,
  cart:createCartType,
  data:messageAndSuccessProps
}
