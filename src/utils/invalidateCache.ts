import { myCache } from "../app"
import { invalidateProps } from "../types/types"

export const cachekeys = new Set<string>

export const addCacheKey = (key:string)=>{
    cachekeys.add(key)
}

export const invalidateKeys = ({
    product,
    order,
    review,
    user,
    coupon,
    admin
}:invalidateProps)=>{
    if(product){
        cachekeys.forEach((key)=>{
            if(key.startsWith("all-products") || key.startsWith("product") || key.startsWith("products-category")){
                myCache.del(key)
            }
            cachekeys.delete(key)
        })
    }
    if(order){
        cachekeys.forEach((key)=>{
            if(key.startsWith("order") || key.startsWith("my-orders") || key.startsWith("all-orders")){
                myCache.del(key)
            }
            cachekeys.delete(key)
        })
    }
    if(review){
        cachekeys.forEach((key)=>{
            if(key.startsWith("single-review") || key.startsWith("all-reviews") ){
                myCache.del(key)
            }
            cachekeys.delete(key)
        })
    }
    if(user){
        cachekeys.forEach((key)=>{
            if(key.startsWith("single-user") || key.startsWith("all-users")){
                myCache.del(key)
            }
            cachekeys.delete(key)
        })
    }
    if(coupon){
        cachekeys.forEach((key)=>{
            if(key.startsWith("all-coupons") || key.startsWith("coupon")){
                myCache.del(key)
            }
            cachekeys.delete(key)
        })
    }
    if(admin){
        cachekeys.forEach((key)=>{
            if(key.startsWith("stats") || key.startsWith("line-chart") ){
                myCache.del(key)
            }
            cachekeys.delete(key)
        })
    }
}
