import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { userReducer } from "./userReducer";



export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [userReducer.name] : userReducer.reducer
    },
    middleware: (mid) =>
        mid()
            .concat(userApi.middleware)
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
