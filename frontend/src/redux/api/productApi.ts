import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../config/constants";
import type {  categoriesType, productResponse, searchProductInputType, singleProductResponse } from "../../types/api-types";


export const productApi = createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/product`,
        prepareHeaders : (headers)=>{
            const token = localStorage.getItem("token")
            if(token){
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
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
                    if(sort) base +=`&sort=${sort}`
                    return base
                }
        }),
        getSingleProducts: builder.query<singleProductResponse,{id:string | ""}>({
            query:({id})=>`/get-single-product/${id}`
        })
    })
})

export const {useGetProductsByCategoriesQuery,useLatestProductsQuery,useSearchProductsQuery,useGetSingleProductsQuery} = productApi