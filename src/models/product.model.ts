import { timeStamp } from "console";
import { newProductTypes } from "../types/product";
import mongoose from "mongoose";

export interface IProduct extends Document{
    name:String,
    category:string,
    stock:number,
    price:number,
    photo:string,
   description:string,
   ratings:number,
   numberOfRating:number
}

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"enter product name"]
    },
    category:{
        type:String,
        required:[true,"enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"enter stock"]
    },
    price:{
        type:Number,
        required:[true,"enter price"]
    },    
    photo:{
        type:String,
        required:[true,"enter photo"]
    },      
    description:{
        type:String,
        required:[true,"enter description"]
    },
    ratings:{
        type:Number,
        default:0
    },
    numberOfRating:{
        type:Number,
        default:0
    }

},{timestamps:true})


export const Product = mongoose.model<IProduct>("Product",productSchema)
