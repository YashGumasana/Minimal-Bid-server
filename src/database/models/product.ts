import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: { type: String, default: null },
    productDescription: { type: String, default: null },
    productCategory: { type: String, default: null },
    productPrice: { type: Number, default: 0 },
    productImage: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    appliedBy: { type: [{ type: mongoose.Schema.Types.ObjectId }], ref: 'user' }
}, { timestamps: true })

export const productModel = mongoose.model("product", productSchema)