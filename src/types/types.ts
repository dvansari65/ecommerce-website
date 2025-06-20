
import { NextFunction, Request, Response } from "express";


export type controllerType = (
    req:Request,
    res:Response,
    next:NextFunction
)=>Promise< void | Response <any, Record<string,any>>>


export interface baseQuery {
    search?:{
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
    sort?:string
}

export interface reviewPropsType  {
    comment?:string,
    rating?:number,
}
export type productIdType = {
    productId:string
}

export type invalidateProps = {
    product?:boolean,
    order?:boolean,
    review?:boolean
}