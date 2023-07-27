import mongoose from "mongoose";

const authenticationSchema = new mongoose.Schema({
    userName: { type: String, default: null },
    fullName: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: Number, default: null },
    password: { type: String, default: null },
    category: { type: Number, default: 0, enum: [0, 1] }, //'user', 'seller', 'Officer', 'Builder'
    gender: { type: Number, default: 0, enum: [0, 1] }, // Male,Female
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },

})

export const authenticationModel = mongoose.model("user", authenticationSchema)