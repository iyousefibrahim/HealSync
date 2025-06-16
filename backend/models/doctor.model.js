const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters"]
    },
    fullName: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
        minlength: [4, "Username must be at least 4 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    specialization: {
        type: String,
        required: [true, "Specialization is required"]
    },
    availableSlots: [{
        day: {
            type: String,
            required: [true, "Day is required"]
        },
        timeSlots: {
            type: [String],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: "At least one time slot is required"
            }
        }
    }],
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    fee: {
        type: Number,
        required: [true, "Consultation fee is required"],
        min: [0, "Fee cannot be negative"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);