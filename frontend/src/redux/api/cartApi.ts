import { server } from "@/config/constants";
import type { getCartProductsType } from "@/types/api-types";
import type { CartProps } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const cartApi = createApi({
    reducerPath : "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl:`${server}/api/v1/cart`,
        credentials:"include"
    }),
    tagTypes: ["Cart"],
    endpoints : (builder)=>({
        createCart : builder.mutation<CartProps,{id:string}>({
            query:({id})=>({
                url:`/create-cart/${id}`,
                method:"POST",
            }),
            invalidatesTags:["Cart"]

        }),
        getCartProducts : builder.query <getCartProductsType,void>({
            query : ()=>({
                url:"/get-cart-products"
            }),
            providesTags:["Cart"]
        })
        
    })
})


export const {useCreateCartMutation,useGetCartProductsQuery}  = cartApi