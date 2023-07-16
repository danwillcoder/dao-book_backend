 // first name, last name, email address, ahpra number, password

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pracSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    AhpraNumber: {
        type: String,
        require: true
    }
});

let Prac = mongoose.model('Prac', pracSchema);

module.exports = Prac;