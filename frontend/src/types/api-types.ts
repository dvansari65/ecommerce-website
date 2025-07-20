import type { Cart, messageAndSuccessProps, Product, Review, User } from "./types"

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
export interface shippingInfo  {
    address:string,
    pinCode:string ,
    city:string,
    state:string,
    country:string
}
export type productTypeFromOrder = {
    name:string,
    photo:string,
    price : number,
    quantity:number,
    productId:string
}

export interface Order {
    _id:string,
    success:boolean,
    message:string,
    order:shippingInfo,
    user:User,
    subtotal:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    total:number,
    status:string,
    orderitems:productTypeFromOrder[],
    createdAt:string
}

export type couponInitialStateTypes = {
    code:number | null,
    amount:number | null,
    _id:string
 }
 export type applyDiscountResponseTypes = {
    message:string,
    success:boolean,
    discount:couponInitialStateTypes
 }


export type orderReponse = {
    status:string,
    subtotal:number,
    total:number,
    tax:number,
    shippingCharges:number,
    discount:number,
    createdAt?:string,
    shippingInfo:shippingInfo,
    orderItems:productTypeFromOrder[],
    _id:string
}
export type createPaymentResponse = {
    clientSecret:string,
    message:string,
    success:boolean,
    subtotal:number,
    total:number,
    tax:number,
    shippingCharges:number,
    discount:number
    shippingInfo:shippingInfo,
    cart:Cart,
    CouponMessage:string,
   
}

export type myOrdersResponse = {
    message:string,
    success:boolean,
    numberOfOrders:number,
    totatPages:number,
    createdAt:string
    orders:orderReponse[],
    
}
export type increaseQuantityResponseProps = {
    message:string,
    success:boolean,
    quantity:number
}
export type increaseQuantityInputProps = {
    orderId:string,
    productId:string,
    page?:number
}
export type reviewData = {
    comment:string,
    rating:number,
    product:Pick<Product,"name" | "category">
    user:Pick<User,"userName">
}
export type addReviewResponseTypes = {
    success:boolean,
    message:string,
    review:reviewData
}
export interface addReviewInputType  {
    comment:string,
    rating:number,
    productId:string
}