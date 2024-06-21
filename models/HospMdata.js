const mongoose = require('mongoose');

const HospitalDataSchema = new mongoose.Schema({
    patientReferralAccepted: {
        type: Number,
        default: 0
    },
    patientReferred: {
        type: Number,
        default: 0
    },
    totalService: {
        type: Number,
        default: 0
    },
    patientIntake: {
        type: Number,
        default: 0
    },
    totalExchange: {
        type: Number,
        default: 0
    },
    wallet: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        unique: true // Assuming each email is unique
    }
});

const HospitalData = mongoose.model('HospitalData', HospitalDataSchema);

module.exports = HospitalData;
