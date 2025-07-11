import { server } from "@/config/constants";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const couponApi = createApi({
    reducerPath:"couponApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/coupon`,
        credentials:"include"
    }),
    endpoints:(builder)=>({

        


    })
})

