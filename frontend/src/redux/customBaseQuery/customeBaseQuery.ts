import { server } from "@/config/constants";
import { fetchBaseQuery} from  "@reduxjs/toolkit/query/react";

import {
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
  } from "@reduxjs/toolkit/query";
import type { refreshDataResponse } from "@/types/types";
  

console.log("danish:")
const baseQuery = fetchBaseQuery({
    baseUrl:`${server}/api/v1/user`,
    credentials:"include"
})

export const customBaseQuery:BaseQueryFn<
string | FetchArgs,
unknown,
FetchBaseQueryError
> = async (args,api,extraOptions)=>{
    // console.log("customBaseQuery called with args:", args);
    let result = await baseQuery(args,api,extraOptions)


    if(result.error?.status === 401){
        // console.log("401 detected, trying refresh...");
        const refreshResult = await baseQuery("/refreshToken",api,extraOptions)

        const refreshData = refreshResult.data as refreshDataResponse
        if(refreshData?.success){
            // console.log("refreshData?.success",refreshData?.success)
             result = await baseQuery(args,api,extraOptions)
        }else{
            // console.log("Refresh failed, logging out");
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            window.location.href = "/login"
        }
    }
    return result
}

