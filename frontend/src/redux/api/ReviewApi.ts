import { server } from "@/config/constants";
import type { addReviewInputType, addReviewResponseTypes, productReviewInputType, productReviews } from "@/types/api-types";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";


export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: customBaseQuery,
    tagTypes:["review"],
    endpoints: (builder) => ({
        getProductReviews: builder.query<productReviews, productReviewInputType>({
            query: ({id,page}) => `/review/get-product-review/${id}?page=${page}`,
            providesTags:["review"]
        }),
        addReview: builder.mutation<addReviewResponseTypes,addReviewInputType>({
            query:({productId,comment,rating}:addReviewInputType)=>({
                url:`/review/add-review?productId=${productId}`,
                method:"POST",
                body:{comment,rating}
            }),
           invalidatesTags:["review"]
        })
    })
})

export const {useGetProductReviewsQuery,useAddReviewMutation} = reviewApi
