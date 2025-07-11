import { server } from "@/config/constants";
import type { productReviewInputType, productReviews } from "@/types/api-types";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";


export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getProductReviews: builder.query<productReviews, productReviewInputType>({
            query: ({id,page}) => `/review/get-product-review/${id}?page=${page}`
        })

    })
})

export const {useGetProductReviewsQuery} = reviewApi
