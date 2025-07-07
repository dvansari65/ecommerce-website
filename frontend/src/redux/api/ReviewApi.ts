import { server } from "@/config/constants";
import type { productReviewInputType, productReviews } from "@/types/api-types";
import type { Review } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/review`,
       credentials:"include",
       prepareHeaders:(headers)=>{
        try {
            const token = localStorage.getItem("token")
            if(token){
                headers.set("authorization", `Bearer ${token}`);
            }
        } catch (error) {
            console.log("failed to set header:",error)
        }
        return headers
    }
    }),
    endpoints: (builder) => ({
        getProductReviews: builder.query<productReviews, productReviewInputType>({
            query: ({id,page}) => `/get-product-review/${id}?page=${page}`
        })

    })
})

export const {useGetProductReviewsQuery} = reviewApi
