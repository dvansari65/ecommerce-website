import mongoose, { mongo } from "mongoose";


const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:[true,"enter code "],
        unique:true
    },
    amount:{
        type:Number,
        required: [true, "Please enter the Discount Amount"],
    }
},{timestamps:true})

export const Coupon = mongoose.model("Coupen",couponSchema)