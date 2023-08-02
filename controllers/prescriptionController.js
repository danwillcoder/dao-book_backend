const Prescription = require('../models/prescriptionModel');


// Get all prescriptions.
exports.getPrescriptions = (req, res, next) => {
    Prescription.find()
        .then(prescriptions => {
            res.status(200).json({
                message: 'Fetched prescriptions successfully.',
                prescriptions: prescriptions
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Get a single prescription by ID.
exports.getPrescription = (req, res, next) => {
    const prescriptionId = req.params.prescriptionId;
    Prescription.findById(prescriptionId)
        .then(prescription => {
            if (!prescription) {
                return res.status(404).json({
                    message: 'Prescription not found.'
                });
            }
            res.status(200).json({
                message: 'Fetched prescription successfully.',
                prescription: prescription
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Get all prescriptions belonging to a practitioner.
exports.getPrescriptionsByPracId = (req, res, next) => {
    const pracId = req.params.pracId;
    Prescription.find({ pracId: pracId })
        .then(prescriptions => {
            if (!prescriptions) {
                return res.status(404).json({
                    message: 'Prescriptions not found.'
                });
            }
            res.status(200).json({
                message: 'Fetched prescriptions successfully.',
                prescriptions: prescriptions
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Get all prescriptions belonging to a patient.
exports.getPrescriptionsByPatientId = (req, res, next) => {
    const patientId = req.params.patientId;
    Prescription.find({ patientId })
        .then(prescriptions => {
            if (!prescriptions) {
                return res.status(404).json({
                    message: 'Prescriptions not found.'
                });
            }
            res.status(200).json({
                message: 'Fetched prescriptions successfully.',
                prescriptions: prescriptions
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Get all prescriptions belonging to a session.
exports.getPrescriptionsBySessionId = (req, res, next) => {
    const sessionId = req.params.sessionId;
    Prescription.find({ sessionId })
        .then(prescriptions => {
            if (!prescriptions) {
                return res.status(404).json({
                    message: 'Prescriptions not found for this session.'
                });
            }
            res.status(200).json({
                message: 'Fetched prescriptions successfully for this session.',
                prescriptions: prescriptions
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Create a new prescription.
exports.createPrescription = (req, res, next) => {
    const prescription = new Prescription({
        sessionId: req.body.sessionId,
        practitionerId: req.practitioner._id,
        practitionerName: req.practitioner.firstName + ' ' + req.practitioner.lastName,
        patientId: req.body.patientId,
        formulaName: req.body.formulaName,
        composition: req.body.composition,
        dosageAdministration: req.body.dosageAdministration,
        lifestyleAdvice: req.body.lifestyleAdvice,
        createdDate: Date.now()
    });

    prescription.save()
        .then(result => {
            res.status(201).json({
                message: 'Created prescription successfully.',
                prescription: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Update a prescription by ID.
exports.updatePrescription = (req, res, next) => {
    const prescriptionId = req.params.prescriptionId;
    const formulaName = req.body.formulaName;
    const composition = req.body.composition;
    const dosageAdministration = req.body.dosageAdministration;
    const lifestyleAdvice = req.body.lifestyleAdvice;

    Prescription.findById(prescriptionId)
        .then(prescription => {
            if (!prescription) {
                return res.status(404).json({
                    message: 'Prescription not found.'
                });
            }
            prescription.formulaName = formulaName;
            prescription.composition = composition;
            prescription.dosageAdministration = dosageAdministration;
            prescription.lifestyleAdvice = lifestyleAdvice;
            return prescription.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Prescription updated.',
                prescription: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Delete a prescription by ID.
exports.deletePrescription = (req, res, next) => {
    const prescriptionId = req.params.prescriptionId;
    Prescription.findById(prescriptionId)
        .then(prescription => {
            if (!prescription) {
                return res.status(404).json({
                    message: 'Prescription not found.'
                });
            }
            return Prescription.findByIdAndRemove(prescriptionId);
        })
        .then(result => {
            res.status(200).json({
                message: 'Prescription deleted.'
            });
        })
        .catch(err => {
            console.log(err);
        });
}