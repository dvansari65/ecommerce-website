import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";
import type { myOrdersResponse, Order, orderReponse } from "@/types/api-types";


export const orderApi = createApi({
    reducerPath:"orderApi",
    baseQuery:customBaseQuery,
    tagTypes:['order'],
    endpoints:(builder)=>({
        createOrder:builder.mutation<Order,orderReponse>({
            query:(orderReponse)=>({
                url:"/order/create-order",
                method:"POST",
                body:orderReponse
            }),
            invalidatesTags:["order"]
        }),
        myOrder:builder.query<myOrdersResponse,{page:number}>({
            query:({page})=>({
                url:`/order/my-orders?page-${page}`
            }),
            providesTags:["order"]
        })
    })
})

export const {useCreateOrderMutation,useMyOrderQuery} = orderApi