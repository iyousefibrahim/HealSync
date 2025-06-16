const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    secretaryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Secretary",
        required: false,
    },

    appointmentDate: {
        type: Date,
        required: true,
        validate: {
            validator: (v) => v instanceof Date && v > new Date(),
            message: "Appointment date must be in the future",
        },
    },

    status: {
        type: String,
        enum: ["pending", "waiting_for_payment", "paid", "confirmed", "cancelled", "completed"],
        default: "pending",
    },

    createdBy: {
        type: String,
        enum: ["patient", "secretary"],
        required: true,
    },

    confirmedBy: {
        type: String,
        enum: ["secretary", "doctor", "system", null],
        default: null,
    },

    notes: {
        type: String,
        maxlength: 500,
        default: "",
    },

    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "refunded"],
        default: "unpaid",
    },

    paymentMethod: {
        type: String,
        enum: ["cash", "card", "wallet", "online", null],
        default: null,
    },

    paymentDate: {
        type: Date,
        default: null,
    },

    paymentAmount: {
        type: Number,
        min: 0,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
