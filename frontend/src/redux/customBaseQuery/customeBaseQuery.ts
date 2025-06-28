import { server } from "@/config/constants";
import { fetchBaseQuery} from  "@reduxjs/toolkit/query/react";
import {
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
  } from "@reduxjs/toolkit/query";
import type { refreshDataResponse } from "@/types/types";
  


const baseQuery = fetchBaseQuery({
    baseUrl:`${server}/api/v1/user`,
    credentials:"include"
})

export const customBaseQuery:BaseQueryFn<
string | FetchArgs,
unknown,
FetchBaseQueryError
> = async (args,api,extraOptions)=>{
    let result = await baseQuery(args,api,extraOptions)

    if(result.error?.status === 401){
        const refreshResult = await baseQuery("/refreshToken",api,extraOptions)

        const refreshData = refreshResult.data as refreshDataResponse
        if(refreshData.success){
             result = await baseQuery(args,api,extraOptions)
        }
    }
    return result
}

