import type { Product, User } from "./types"

export type messageResponse = {
    message:string,
    success:boolean,
    user:User,
    accessToken?:string,
    refreshToken? : string
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
