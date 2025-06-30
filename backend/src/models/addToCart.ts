import mongoose, { Schema, Types } from "mongoose";



const addToCartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }

    ]
}, { timestamps: true })

export const Cart = mongoose.model("Cart", addToCartSchema)