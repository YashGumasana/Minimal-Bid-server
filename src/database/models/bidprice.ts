import mongoose from "mongoose";

const bidpriceSchema = new mongoose.Schema({
    // productName: { type: String, default: null },
    // productDescription: { type: String, default: null },
    // productCategory: { type: String, default: null },
    bidPrice: { type: Number, default: 0 },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    // productImage: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    productBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })

export const bidpriceModel = mongoose.model("bidprice", bidpriceSchema)