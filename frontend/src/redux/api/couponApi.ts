import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";
import type { applyDiscountResponseTypes, paymentFromCartTypes, shippingInfo } from "@/types/api-types";



export const couponApi = createApi({
    reducerPath:"couponApi",
    baseQuery:customBaseQuery,
    endpoints:(builder)=>({
        placeOrderFromCart : builder.mutation<paymentFromCartTypes,{query:string,shippingInfo:shippingInfo}>({
            query:({query,shippingInfo})=>({
                url:`/coupon/reate-payment?code=${query}`,
                method:'POST',
                body:shippingInfo
            }),
        }),
        applyDiscount : builder.mutation<applyDiscountResponseTypes,{code:string}>({
            query:({code})=>({
                url:`/coupon/apply-discount?code=${code}`,
            })
        })
     })
})

export const {useApplyDiscountMutation,usePlaceOrderFromCartMutation} = couponApi