import type { cartDetailTypes, getCartProductsType } from "@/types/api-types";
import type { CartProps, messageAndSuccessProps } from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";

export const cartApi = createApi({
    reducerPath : "cartApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Cart"],
    endpoints : (builder)=>({
        createCart : builder.mutation<CartProps,{id:string}>({
            query:({id})=>({
                url:`cart/create-cart/${id}`,
                method:"POST",
                
            }),
            invalidatesTags:["Cart"]
        }),
        getCartProducts : builder.query <getCartProductsType,void>({
            query : ()=>({
                url:"/cart/get-cart-products"
            }),
            providesTags:["Cart"]
        }),
        deleteCartProduct : builder.mutation<messageAndSuccessProps,{productId:string}>({
            query:({productId})=>({
                url:`/cart/delete-product/${productId}`,
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
                url:`/cart/decrease-quantity/${productId}`,
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
        }),
        clearCart : builder.mutation<messageAndSuccessProps,void>({
            query:()=>({
                url:"/cart/clear-cart",
                method:'DELETE'
            }),
            invalidatesTags:["Cart"]
        })

        
    })
})


export const {
    useCreateCartMutation,
    useGetCartProductsQuery,
    useDeleteCartProductMutation,
    useIncreaseProductQuantityMutation,
    useDecreaseQuantityMutation,
    useGetCartDetailsQuery,
    useClearCartMutation
}  = cartApi