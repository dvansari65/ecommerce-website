import { createApi } from "@reduxjs/toolkit/query/react";
import type {  categoriesType, productResponse, searchProductInputType, singleProductResponse } from "../../types/api-types";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";


export const productApi = createApi({
    reducerPath:"productApi",
    
    baseQuery:customBaseQuery,
    endpoints:(builder)=>({
        latestProducts : builder.query<productResponse,void>({
            query:()=>{
                console.log("/latest")
                return "/latest"
            }
        }),
        getProductsByCategories : builder.query<categoriesType,void>({
            query:()=>`/product/get-all-categories`
        }),
        searchProducts : builder.query<productResponse,searchProductInputType>({
                query:({search,category,price,page,sort})=>{
                    let base = `/product/filter-product?search=${search}&page=${page}`
                    if(category) base += `&category=${category}`
                    if(price) base += `&price=${price}`
                    if(sort) base +=`&sort=${sort}`
                    return base
                }
        }),
        getSingleProducts: builder.query<singleProductResponse,{id:string}>({
            query:({id})=>`/product/get-single-product/${id}`
        })
    })
})

export const {useGetProductsByCategoriesQuery,useLatestProductsQuery,useSearchProductsQuery,useGetSingleProductsQuery} = productApi
// `filter-products-${page}-${limit}-${category}-${price}-${search}-${sort}`;