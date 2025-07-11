import { server } from "@/config/constants";
import type { cartDetailTypes, getCartProductsType } from "@/types/api-types";
import type { CartProps, messageAndSuccessProps } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const cartApi = createApi({
    reducerPath : "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl:`${server}/api/v1/cart`,
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
    tagTypes: ["Cart"],
    endpoints : (builder)=>({
        createCart : builder.mutation<CartProps,{id:string}>({
            query:({id})=>({
                url:`/create-cart/${id}`,
                method:"POST",
            }),
            invalidatesTags:["Cart"]

        }),
        getCartProducts : builder.query <getCartProductsType,void>({
            query : ()=>({
                url:"/get-cart-products"
            }),
            providesTags:["Cart"]
        }),
        deleteCartProduct : builder.mutation<messageAndSuccessProps,{productId:string}>({
            query:({productId})=>({
                url:`/delete-product/${productId}`,
                method:"DELETE",
            }),
            invalidatesTags:['Cart']
        }),
        increaseProductQuantity : builder.mutation<messageAndSuccessProps,{productId:string}>({
            query:({productId})=>({
                url:`/increase-quantity/${productId}`,
                method:"POST"
            }),
            invalidatesTags:["Cart"],
            async onQueryStarted({productId},{dispatch,queryFulfilled}){
                const patch = dispatch(
                    cartApi.util.updateQueryData("getCartProducts",undefined, (draft)=>{
                            const item = draft.products.find(i=> i.productId?._id === productId)
                            if(item) item.quantity += 1
                    })
                )
                try {
                    await queryFulfilled;
                  } catch {
                    patch.undo();
                  }
            }
        }),
        decreaseQuantity : builder.mutation<messageAndSuccessProps,{productId:string}>({
            query:({productId})=>({
                url:`/decrease-quantity/${productId}`,
                method:"POST",
            }),
            invalidatesTags:['Cart'],
            async onQueryStarted({productId},{dispatch,queryFulfilled}){
                const patch = dispatch(
                    cartApi.util.updateQueryData("getCartProducts",undefined,(draft)=>{
                        const item = draft.products.find(i=>i.productId?._id === productId)
                        if(item) item.quantity -= 1
                    })
                )
                try {
                    await queryFulfilled;
                } catch (error) {
                    patch.undo();
                }
            }
        }),
        getCartDetails : builder.query<cartDetailTypes,void>({
            query:()=>({
                url:"/cart/cart-details",
            })
        })

        
    })
})


export const {
    useCreateCartMutation,
    useGetCartProductsQuery,
    useDeleteCartProductMutation,
    useIncreaseProductQuantityMutation,
    useDecreaseQuantityMutation,
    useGetCartDetailsQuery
}  = cartApi