import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../config/constants";
import type { logoutResponse, messageResponse } from "../../types/api-types";
import type { User } from "../../types/types";
import toast from "react-hot-toast";


export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/user`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {
                headers.set("authorization", `bearer ${token}`)
            }
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation<messageResponse, User>({
            query: (user) => ({
                url: "/login",
                method: "POST",
                body: user
            })
        }),
        getMyProfile: builder.query<messageResponse, void>({
            query: () => "/me",
        }),
        logout : builder.mutation<logoutResponse,void>({
            query:()=>(
                {
                    url:"/logout",
                    method:"POST",
                }
            )
        })
    })
})


export const { useLoginMutation,useGetMyProfileQuery ,useLogoutMutation} = userApi;

