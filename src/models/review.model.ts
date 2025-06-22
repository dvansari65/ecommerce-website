import mongoose from "mongoose";
import { ref } from "process";


const reviewSchema = new mongoose.Schema({

    comment:{
        type:String,
        maxLength:[200,"Comment must not be more than 200 characters"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"please share your experience!"]
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    }

},{timestamps:true})

export const Review = mongoose.model("Review",reviewSchema)