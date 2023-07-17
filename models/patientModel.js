//first name, last name, date of birth, email address, phone number, medications, health history

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
    emailAddress: {
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
    }
});

let Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
