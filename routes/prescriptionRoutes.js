const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const { mustBePrac, verifyPractitionerOwnership, mustBePracOrPatient, verifyOwnership } = require('../middleware/authMiddleware');
const router = express.Router();
const Prescription = require('../models/prescriptionModel');
router.get('/prescriptions', prescriptionController.getPrescriptions);
router.get('/prescription/:prescriptionId', mustBePracOrPatient, verifyOwnership(Prescription, 'prescriptionId'), prescriptionController.getPrescription);
router.get('/prescriptions/prac/:pracId', prescriptionController.getPrescriptionsByPracId);
router.get('/prescriptions/patient/:patientId', mustBePracOrPatient, verifyOwnership(Prescription, 'prescriptionId'), prescriptionController.getPrescriptionsByPatientId);
router.post('/prescription', mustBePrac, prescriptionController.createPrescription);
router.put('/prescription/:prescriptionId', mustBePrac, verifyPractitionerOwnership, prescriptionController.updatePrescription);
router.delete('/prescription/:prescriptionId', prescriptionController.deletePrescription);
module.exports = router;

