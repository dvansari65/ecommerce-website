import type { couponInitialStateTypes } from "@/types/api-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



const initialState: couponInitialStateTypes = {
    code: null,
    amount: null,
    _id: ""
}

export const couponReducer = createSlice({
    name: "couponReducer",
    initialState,
    reducers: {
        setCoupon: (state, action) => {
            const { code, amount, _id } = action.payload;
            state.code = code;
            state.amount = amount;
            state._id = _id;
        }
    }
})

export const { setCoupon } = couponReducer.actions