const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pracSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    ahpraNumber: {
        type: String,
        require: true
    }
});

let Prac = mongoose.model('Prac', pracSchema);

module.exports = Prac;