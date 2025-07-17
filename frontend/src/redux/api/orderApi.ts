import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";
import type {
  increaseQuantityInputProps,
  
  increaseQuantityResponseProps,
  
  myOrdersResponse,
  Order,
  orderReponse,
} from "@/types/api-types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: customBaseQuery,
  tagTypes: ["order"],
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, orderReponse>({
      query: (orderReponse) => ({
        url: "/order/create-order",
        method: "POST",
        body: orderReponse,
      }),
      invalidatesTags: ["order"],
    }),
    myOrder: builder.query<myOrdersResponse, { page: number }>({
      query: ({ page }) => ({
        url: `/order/my-orders?page-${page}`,
      }),
      providesTags: ["order"],
    }),
    increaseQuantity: builder.mutation<
      increaseQuantityResponseProps,
      increaseQuantityInputProps
    >({
      query: ({ productId, orderId, page }) => ({
        url: `/order/increase-quantity?productId=${productId}&orderId=${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["order"],
      async onQueryStarted(
        { productId, orderId, page },
        { dispatch, queryFulfilled }
      ) {
        const patch = dispatch(
          orderApi.util.updateQueryData("myOrder", { page:page ?? 1 }, (draft) => {
            draft.orders.forEach((order) => {
              if (order._id.toString() === orderId) {
                order.orderItems.forEach((product) => {
                  if (product.productId === productId) {
                    product.quantity += 1;
                  } else {
                    product.quantity === 1;
                  }
                });
              }
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useCreateOrderMutation, useMyOrderQuery,useIncreaseQuantityMutation } = orderApi;
