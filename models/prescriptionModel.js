// formula name, composition, dosage & administration, lifestyle advice

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
    formulaName: {
        type: String,
        required: true
    },
    composition: {
        type: String,
        require: true
    },
    dosageAdministration: {
        type: String,
        require: true
    },
    lifestyleAdvice: {
        type: String,
        require: true
    }
});

let Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;