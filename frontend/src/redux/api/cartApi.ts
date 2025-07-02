import { server } from "@/config/constants";
import type { CartProps } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const cartApi = createApi({
    reducerPath : "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl:`${server}/api/v1/cart`,
        credentials:"include"
    }),
    endpoints : (builder)=>({
        createCart : builder.mutation<CartProps,{id:string,quantity:number}>({
            query:({id,quantity})=>({
                url:`/create-cart/${id}`,
                method:"POST",
                body:{quantity}
            }),

        }),
        getCart :builder.query<>(
            {
                
            }
        )
    })
})


export const {useCreateCartMutation}  = cartApi