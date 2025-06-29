import { server } from "@/config/constants";
import type { productReviewInputType, productReviews } from "@/types/api-types";
import type { Review } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/review`,
       credentials:"include"
    }),
    endpoints: (builder) => ({
        getProductReviews: builder.query<productReviews, productReviewInputType>({
            query: ({id,page}) => `/get-product-review/${id}?page=${page}`
        })

    })
})

export const {useGetProductReviewsQuery} = reviewApi
