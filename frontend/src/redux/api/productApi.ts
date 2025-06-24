import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../config/constants";
import type { productResponse } from "../../types/api-types";


export const productApi = createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`${server}/api/v1/product`}),
    endpoints:(builder)=>({
        latestProducts : builder.query<productResponse,void>({
            query:()=>{
                console.log("/latest")
                return "/latest"
            }
        }),
        getProductsByCategories : builder.query<productResponse,string>({
            query:()=>("/get-all-categories")
        })
    })
})

export const {useGetProductsByCategoriesQuery,useLatestProductsQuery} = productApi