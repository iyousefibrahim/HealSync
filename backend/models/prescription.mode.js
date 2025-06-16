const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient is required']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor is required']
    },
    medications: [
        {
            name: {
                type: String,
                required: [true, 'Medication name is required'],
                trim: true
            },
            dosage: {
                type: String,
                required: [true, 'Dosage is required'],
                trim: true
            },
            instructions: {
                type: String,
                required: [true, 'Instructions are required'],
                trim: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes must be less than 1000 characters']
    }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
