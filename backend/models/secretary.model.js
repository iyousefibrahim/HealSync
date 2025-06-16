const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const { ObjectId } = Types;

const secretarySchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [50, "First name must be at most 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [50, "Last name must be at most 50 characters"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [4, "Username must be at least 4 characters"],
        maxlength: [30, "Username must be at most 30 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    profileImage: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    doctors: [
        {
            type: ObjectId,
            ref: "Doctor"
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Secretary", secretarySchema);
