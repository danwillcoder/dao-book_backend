const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    practitionerId: {
        type: Schema.Types.ObjectId,
        ref: 'Prac',
        required: true
    },
    formulaName: {
        type: String,
        required: true
    },
    composition: {
        type: String,
        required: true
    },
    dosageAdministration: {
        type: String,
        required: true
    },
    lifestyleAdvice: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    },
    practitionerName: {
        type: String,
        required: true
    },
    sendEmail: {
        type: Boolean,
        default: false
    }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;