import ShippingInfo from "@/pages/ShippingInfo";
import type { orderReponse } from "@/types/api-types";
import { createSlice } from "@reduxjs/toolkit";


const initialState: orderReponse = {
    shippingCharges: 0,
    total: 0,
    tax: 0,
    subtotal: 0,
    discount: 0,
    shippingInfo: {
        address: "",
        pinCode: 0,
        state: "",
        city: "",
        country: ""
    },
    orderItems: []

}

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        saveShippingInfo: (State, action) => {
            const { address, state, country, pinCode, city } = action.payload
            State.shippingInfo.address = address,
                State.shippingInfo.state = state,
                State.shippingInfo.country = country,
                State.shippingInfo.pinCode = pinCode,
                State.shippingInfo.city = city
        },
        saveNumericalData: (state, action) => {
            state.discount = action.payload
            state.tax = action.payload
            state.total = action.payload
            state.subtotal = action.payload
            state.shippingCharges = action.payload
        },
        saveOrderItems: (state, action) => {
           state.orderItems = action.payload
        }
    }
})

export const { saveShippingInfo,saveNumericalData,saveOrderItems } = cartReducer.actions