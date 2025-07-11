import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profileImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
    },
}, {timestamps: true})

export const User = mongoose.model("User", userSchema)