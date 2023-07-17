// session date, main complaint, session notes, tongue, pulse

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    pracId: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        required: true
    },
    sessionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    mainComplaint: {
        type: String,
        require: true   
    },
    sessionNotes: {
        type: String,
        require: true
    },
    tongue: {
        type: String,
        require: true
    },
    pulse: {
        type: String,
        require: true
    }
});

let Session = mongoose.model('Session', sessionSchema);

module.exports = Session;