import { myCache } from "../app"



export const invalidateCache = (key:string | string[])=>{
    if(Array.isArray(key)){
        key.forEach(k=>{
            if(myCache.has(k)){
                myCache.del(k)
            }
        })
    }else{
        myCache.del(key)
    }
}
