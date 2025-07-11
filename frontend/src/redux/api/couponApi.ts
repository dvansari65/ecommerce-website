import { server } from "@/config/constants";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";
import type { paymentFromCartTypes, shippingInfo } from "@/types/api-types";



export const couponApi = createApi({
    reducerPath:"couponApi",
    baseQuery:customBaseQuery,
    endpoints:(builder)=>({

        placeOrderFromCart : builder.mutation<paymentFromCartTypes,{query:string,shippingInfo:shippingInfo}>({
            query:({query,shippingInfo})=>({
                url:`/coupon/reate-payment?code=${query}`,
                method:'POST',
                body:shippingInfo
            })
        })
     })
})

