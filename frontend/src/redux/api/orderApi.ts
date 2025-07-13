import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";
import type { Order } from "@/types/api-types";


export const orderApi = createApi({
    reducerPath:"orderApi",
    baseQuery:customBaseQuery,
    tagTypes:['order'],
    endpoints:(builder)=>({
        createOrder:builder.mutation<Order,void>({
            query:()=>({
                url:"/order/create-order",
                method:"POST",
            }),
            invalidatesTags:["order"]
        })
    })
})