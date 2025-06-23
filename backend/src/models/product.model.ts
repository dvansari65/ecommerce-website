import { timeStamp } from "console";
import { newProductTypes } from "../types/product";
import mongoose from "mongoose";

export interface IProduct extends Document {
    name: String,
    category: string,
    stock: number,
    price: number,
    photo: string,
    description: string,
    ratings: number,
    numberOfRating: number,
    discountedPrice?: number,
    discount?: number
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "enter product name"],
        index:true
    },
    category: {
        type: String,
        required: [true, "enter product category"],
        trim: true,
        index:true
    },
    stock: {
        type: Number,
        required: [true, "enter stock"]
    },
    price: {
        type: Number,
        required: [true, "enter price"],
        index:true
    },
    photo: {
        type: String,
        required: [true, "enter photo"]
    },
    description: {
        type: String,
        required: [true, "enter description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfRating: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

productSchema.virtual("discountedPrice").get(function (this: IProduct) {
    if (!this.discount || this.discount <= 0) return this.price;
    return this.price - (this.price * this.discount) / 100;
});
export const Product = mongoose.model<IProduct>("Product", productSchema)
