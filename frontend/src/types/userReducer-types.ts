import type { shippingInfo } from "./api-types";
import type { User } from "./types";

export interface userReducerInitialState{
    user:User,
    loading:boolean,
   
}