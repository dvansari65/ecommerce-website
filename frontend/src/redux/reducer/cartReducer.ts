import type { shippingInfo } from "@/types/api-types";
import { createSlice } from "@reduxjs/toolkit";


const initialState:shippingInfo = {
    address:"",
    state:"",
    country:"",
    pinCode:0,
    city:""
}

export const cartReducer = createSlice({
    name:"cartReducer",
    initialState,
    reducers:{
        saveShippingInfo : (State,action)=>{
            const {address,state,country,pinCode,city} = action.payload
            State.address = address,
            State.state = state,
            State.country = country,
            State.pinCode = pinCode,
            State.city = city
        }
    }
})

export const {saveShippingInfo} = cartReducer.actions