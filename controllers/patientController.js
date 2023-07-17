const Patient = require('../models/patientModel');

exports.getPatients = (req, res, next) => {
    Patient.find()
        .then(patients => {
            res.status(200).json({
                message: 'Fetched patients successfully.',
                patients: patients
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getPatient = (req, res, next) => {
    const patientId = req.params.patientId;
    Patient.findById(patientId)
        .then(patient => {
            if (!patient) {
                return res.status(404).json({
                    message: 'Patient not found.'
                });
            }
            res.status(200).json({
                message: 'Fetched patient successfully.',
                patient: patient
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.createPatient = (req, res, next) => {

    const patient = new Patient({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        emailAddress: req.body.emailAddress,
        phoneNumber: req.body.phoneNumber,
        medications: req.body.medications,
        healthHistory: req.body.healthHistory
    });

    patient.save()
        .then(result => {
            res.status(201).json({
                message: 'Created patient successfully.',
                patient: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.updatePatient = (req, res, next) => {
    const patientId = req.params.patientId;
    Patient.findById(patientId)
        .then(patient => {
            if (!patient) {
                return res.status(404).json({
                    message: 'Patient not found.'
                });
            }
            patient.firstName = req.body.firstName;
            patient.lastName = req.body.lastName;
            patient.dateOfBirth = req.body.dateOfBirth;
            patient.emailAddress = req.body.emailAddress;
            patient.phoneNumber = req.body.phoneNumber;
            patient.medications = req.body.medications;
            patient.healthHistory = req.body.healthHistory;
            return patient.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Updated patient successfully.',
                patient: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.deletePatient = (req, res, next) => {
    const patientId = req.params.patientId;
    Patient.findByIdAndDelete(patientId)
        .then(patient => {
            if (!patient) {
                const error = new Error('Could not find patient.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: 'Patient deleted successfully.',
                patient: patient
            });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
