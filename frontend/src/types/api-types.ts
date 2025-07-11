import type { messageAndSuccessProps, Product, Review, User } from "./types"

export type messageResponse = {
    message:string,
    success:boolean,
    user:User,
    accessToken?:string,
}
export type productResponse = {
    success:boolean,
    message:string,
    totalPage:number,
    products:Product[]
}

export type logoutResponse = {
    message:string,
    success:boolean
}
export type categoriesType = logoutResponse & {
    products:string[]
}

export type searchProductInputType = {
    page:number,
    search:string,
    category:string,
    price:number,
    sort:string
}
export type singleProductResponse = logoutResponse & { 
    product:Product
}

export type productReviewInputType = {
    id:string,
    page:number
}

export type productReviews = {
    reviews:Review[],
    message:string,
    success:boolean,
    totalPage:number
}
export type cartProduct = {
    productId : Product,
    quantity:number,
    _id:string
}

export type getCartProductsType = {
    message:string,
    success:boolean,
    products:cartProduct[]
}
export interface cartDetailProps {
    shippingCharges:number,
    tax:number,
    subtotal:number
}
export type cartDetailTypes = {
    message:string,
    success:boolean,
    cartDetails:cartDetailProps
}
export type paymentFromCartTypes = {
    message:string,
    success:true,
    clientSecret:string
}
export type shippingInfo = {
    address:string,
    pinCode:number,
    city:string,
    state:string,
    country:string
}