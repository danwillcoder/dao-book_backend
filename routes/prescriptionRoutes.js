const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const router = express.Router();
router.get('/prescriptions', prescriptionController.getPrescriptions);
router.get('/prescription/:prescriptionId', prescriptionController.getPrescription);
router.get('/prescriptions/prac/:pracId', prescriptionController.getPrescriptionsByPracId);
router.get('/prescriptions/patient/:patientId', prescriptionController.getPrescriptionsByPatientId);
router.post('/prescription', prescriptionController.createPrescription);
router.put('/prescription/:prescriptionId', prescriptionController.updatePrescription);
router.delete('/prescription/:prescriptionId', prescriptionController.deletePrescription);
module.exports = router;

