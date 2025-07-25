
import { NextFunction, Request, Response } from "express";


export type controllerType = (
    req:Request,
    res:Response,
    next:NextFunction
)=>Promise< void | Response <any, Record<string,any>>>


export interface baseQuery {
    name?:{
        $regex:string,
        $options:string
    },
    price?:{
        $lte:number
    },
    category?:string
}

export type searchQuery = {
    search:string,
    price:number,
    category:string,
    stock?:number,
    sort?:string,
    page:number
}

export type reviewPropsType =   {
    comment:string,
    rating:number,
}
export type productIdType ={
    productId:string
}

export type invalidateProps = {
    product?:boolean,
    order?:boolean,
    review?:boolean,
    user?:boolean,
    coupon?:boolean,
    admin?:boolean,
    cart?:boolean
}

export type JWTtype = {
    _id:string
}
export type  optionsType = {
    httpOnly: boolean,
    secure: boolean,
    sameSite:string
}

export type addCartType = {
    quantity:number
}
export type ReqUser = {
    userId : string
}

export type item = {
    quantity:number,
    productId:productIdType
}
export type CartType = {
    user:string,
    items:[
        item
    ]
}
export type couponType = {
    code:string,
    amount:number,
    _id:string
}
