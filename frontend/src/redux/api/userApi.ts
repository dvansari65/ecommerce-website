import { createApi } from "@reduxjs/toolkit/query/react";
import type { logoutResponse, messageResponse } from "../../types/api-types";
import type { User } from "../../types/types";
import { customBaseQuery } from "../customBaseQuery/customeBaseQuery";


export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: customBaseQuery,
    
    endpoints: (builder) => ({
        login: builder.mutation<messageResponse, User>({
            query: (user) => ({
                url: "/user/login",
                method: "POST",
                body: user,
            })
        }),
        getMyProfile: builder.query<messageResponse, void>({
            query: () => "/user/me",
        }),
        logout : builder.mutation<logoutResponse,void>({
            query:()=>(
                {
                    url:"/user/logout",
                    method:"POST",
                }
            )
        })
    })
})


export const { useLoginMutation,useGetMyProfileQuery ,useLogoutMutation} = userApi;

