const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    dateOfBirth: {
        type: Date,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    medications: {
        type: String,
        require: true
    },
    healthHistory: {
        type: String,
        require: true
    },
    // practitioner ID is automatically added to the patient object when the patient is created.
    practitionerId: {
        type: Schema.Types.ObjectId,
        ref: 'Prac',
        required: true
    },
    practitionerName: {
        type: String,
        required: true
    }
});

let Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
