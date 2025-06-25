import type { Product, User } from "./types"

export type messageResponse = {
    message:string,
    success:boolean,
    user:User,
    accessToken:string
}
export type productResponse = {
    success:boolean,
    message:string,
    products:Product[]
}

export type logoutResponse = {
    message:string,
    success:boolean
}