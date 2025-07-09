import { server } from "@/config/constants";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { refreshDataResponse } from "@/types/types";
import {  userNotExist } from "../reducer/userReducer";


console.log("danish:")
const baseQuery = fetchBaseQuery({
    baseUrl: `${server}/api/v1/user`,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
      }
})

export const customBaseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    

    if (result.error?.status === 401) {
        // console.log("401 detected, trying refresh...");
        const refreshResult = await baseQuery("/refreshToken", api, extraOptions)

        const refreshData = refreshResult.data as refreshDataResponse
        // console.log("refreshData?.success",refreshData?.success)
        if (refreshData?.success && refreshData.accessToken) {
            console.log("refreshData?.success",refreshData?.success)
            localStorage.setItem("token", refreshData.accessToken);
            result = await baseQuery(args, api, extraOptions)
        } else {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login";
            api.dispatch(userNotExist())
        }
    }
    return result
}

