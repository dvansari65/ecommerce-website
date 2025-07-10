import { server } from "@/config/constants";
import type { couponDiscountProps } from "@/types/api-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const couponApi = createApi({
    reducerPath:"couponApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/coupon`,
        credentials:"include"
    }),
    endpoints:(builder)=>({

        getDiscount : builder.mutation<couponDiscountProps,{code:string}>({
            query:({code})=>({
                url : `/apply-discount?code=${code}`
            })
        })


    })
})

export const {useGetDiscountMutation} = couponApi