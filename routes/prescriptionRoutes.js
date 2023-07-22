const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const mustBePrac = require('../middleware/authMiddleware');
const router = express.Router();
const verifyPractitionerOwnership = require('../middleware/authMiddleware');
router.get('/prescriptions', prescriptionController.getPrescriptions);
router.get('/prescription/:prescriptionId', prescriptionController.getPrescription);
router.get('/prescriptions/prac/:pracId', prescriptionController.getPrescriptionsByPracId);
router.get('/prescriptions/patient/:patientId', prescriptionController.getPrescriptionsByPatientId);
router.post('/prescription', mustBePrac, prescriptionController.createPrescription);
router.put('/prescription/:prescriptionId', verifyPractitionerOwnership, prescriptionController.updatePrescription);
router.delete('/prescription/:prescriptionId', prescriptionController.deletePrescription);
module.exports = router;

