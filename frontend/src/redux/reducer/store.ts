import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { userReducer } from "./userReducer";
import { productApi } from "../api/productApi";
import { reviewApi } from "../api/ReviewApi";
import { cartApi } from "../api/cartApi";
import { couponApi } from "../api/couponApi";
import { couponReducer } from "./couponReducer";
import { cartReducer } from "./cartReducer";



export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [userReducer.name] : userReducer.reducer,
        [couponReducer.name] : couponReducer.reducer,
        [cartReducer.name] : cartReducer.reducer,
        [productApi.reducerPath] : productApi.reducer,
        [reviewApi.reducerPath] : reviewApi.reducer,
        [cartApi.reducerPath] : cartApi.reducer,
        [couponApi.reducerPath] : couponApi.reducer
    },
    middleware: (mid) =>
        mid()
            .concat(userApi.middleware)
            .concat(productApi.middleware)
            .concat(reviewApi.middleware)
            .concat(cartApi.middleware)
            .concat(couponApi.middleware)
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
