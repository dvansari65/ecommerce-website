import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../config/constants";
import type {  categoriesType, productResponse, searchProductInputType } from "../../types/api-types";


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
        getProductsByCategories : builder.query<categoriesType,void>({
            query:()=>`/get-all-categories`
        }),
        searchProducts : builder.query<productResponse,searchProductInputType>({
                query:({search,category,price,page,sort})=>{
                    let base = `/filter-product?search=${search}&page=${page}`
                    if(category) base += `&category=${category}`
                    if(price) base += `&price=${price}`
                    if(sort) sort +=`&sort=${sort}`
                    return base
                }
        })
    })
})

export const {useGetProductsByCategoriesQuery,useLatestProductsQuery,useSearchProductsQuery} = productApi