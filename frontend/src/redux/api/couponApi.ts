import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";
import type { applyDiscountResponseTypes, messageResponse, paymentFromCartTypes, shippingInfo } from "@/types/api-types";
import type { messageAndSuccessProps } from "@/types/types";



export const couponApi = createApi({
    reducerPath:"couponApi",
    baseQuery:customBaseQuery,
    endpoints:(builder)=>({
        
        applyDiscount : builder.mutation<applyDiscountResponseTypes,{code:string}>({
            query:({code})=>({
                url:`/coupon/apply-discount?code=${code}`,
            })
        }),
        deleteCoupon : builder.mutation<messageAndSuccessProps,{id:string}>({
            query:({id})=>({
                url:`/coupon/delete-coupon/${id}`
            })
        })
     })
})

export const {useApplyDiscountMutation,useDeleteCouponMutation} = couponApi