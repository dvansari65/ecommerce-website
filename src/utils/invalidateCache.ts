import { myCache } from "../app"
import { invalidateProps } from "../types/types"

export const cachekeys = new Set<string>

export const addCacheKey = (key:string)=>{
    cachekeys.add(key)
}

export const invalidateCache = (key:string | string[])=>{
    if(Array.isArray(key)){
        key.forEach(k=>{
            if(myCache.has(k)){
                myCache.del(k)
            }
            cachekeys.delete(k);
        })
       
    }else{
        myCache.del(key)
        cachekeys.delete(key);
    }
}
export const invalidateKeys = ({
    product,
    order,
    review
}:invalidateProps)=>{
    if(product){
        cachekeys.forEach((key)=>{
            if(key.startsWith("all-products") || key.startsWith("product") || key.startsWith("products-category")){
                myCache.del(key)
            }
        })
    }
    if(order){
        cachekeys.forEach((key)=>{
            if(key.startsWith("order") || key.startsWith("my-orders") || key.startsWith("all-orders")){
                myCache.del(key)
            }
        })
    }
    if(review){
        cachekeys.forEach((key)=>{
            if(key.startsWith("single-review") || key.startsWith("all-reviews") ){
                myCache.del(key)
            }
        })
    }
}
