import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { userReducer } from "./userReducer";
import { productApi } from "../api/productApi";



export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [userReducer.name] : userReducer.reducer,
        [productApi.reducerPath] : productApi.reducer
    },
    middleware: (mid) =>
        mid()
            .concat(userApi.middleware)
            .concat(productApi.middleware)
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
