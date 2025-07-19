import ShippingInfo from "@/pages/ShippingInfo";
import type { orderReponse } from "@/types/api-types";
import { createSlice } from "@reduxjs/toolkit";


const initialState: orderReponse = {
    shippingCharges: 0,
    _id:'',
    status,
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
        saveShippingInfo: (state, action) => {
            const { address, state: st, country, pinCode, city } = action.payload
            state.shippingInfo.address = address;
            state.shippingInfo.state = st;
            state.shippingInfo.country = country;
            state.shippingInfo.pinCode = pinCode;
            state.shippingInfo.city = city;
        },
        saveNumericalData: (state, action) => {
            const { subtotal, tax, shippingCharges, discount, total ,status} = action.payload;
            state.subtotal = subtotal;
            state.tax = tax;
            state.shippingCharges = shippingCharges;
            state.discount = discount;
            state.total = total;
            state.status = status
        },
        saveOrderItems: (state, action) => {
            state.orderItems = action.payload
        }
    }
})

export const { saveShippingInfo, saveNumericalData, saveOrderItems } = cartReducer.actions