const Patient = require('../models/patientModel');


// Get all patients.
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


// Get all patients belonging to a practitioner.
exports.getPatientsByPracId = (req, res, next) => {
    const practitionerId = req.params.practitionerId;
    Patient.find({ practitionerId: practitionerId })
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


// Get a single patient by ID.
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


// Create a new patient.
exports.createPatient = (req, res, next) => {
    const newPatientObject = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        medications: req.body.medications,
        healthHistory: req.body.healthHistory,
        practitionerId: req.practitioner._id, 
        practitionerName: req.practitioner.firstName + ' ' + req.practitioner.lastName
    }

    const uniquePatientFields = {
        firstName: newPatientObject.firstName,
        lastName: newPatientObject.lastName,
        dateOfBirth: newPatientObject.dateOfBirth,
        email: newPatientObject.email
    }
    // Check if patient already exists. If so, throw error.
    Patient.findOne(uniquePatientFields).then(databasePatient => {
        if (databasePatient) {
                const error = new Error('Patient already exists');
                error.statusCode = 403;
                throw error;
        } else {
                const patient = new Patient(newPatientObject);
                return patient;
        }

    })
    .then(patient => patient.save())
    .then(result => {
            res.status(201).json({
                message: 'Created patient successfully.',
                patient: result
            });
        })
        .catch(err => {
            console.log(err);
            next(err)
        });
}


// Update a patient by ID.
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
            patient.email = req.body.email;
            patient.phoneNumber = req.body.phoneNumber;
            patient.medications = req.body.medications;
            patient.healthHistory = req.body.healthHistory;
            patient.practitionerId = req.practitioner._id;
            patient.practitionerName = req.practitioner.firstName + ' ' + req.practitioner.lastName;

            // Since this is an update operation, we don't update practitionerId and practitionerName.
            // The patient's practitioner should remain the same.

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
            res.status(500).json({
                message: 'An error occurred while updating the patient.'
            });
        });
}


// Delete a patient by ID.
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