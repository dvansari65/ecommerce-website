import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../config/constants";


export const productApi = createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`${server}/api/v1/product`}),
    endpoints:(builder)=>({
        getProductById : builder.query<>({
            query:()=>{
                
            }
        })
    })
})