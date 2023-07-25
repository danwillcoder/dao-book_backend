const express = require('express');
const patientController = require('../controllers/patientController');
const authController = require('../controllers/authController');
const router = express.Router();
const { mustBePrac, verifyPractitionerOwnership } = require('../middleware/authMiddleware');
router.get('/patients', patientController.getPatients);
router.get('/patient/:patientId', patientController.getPatient);
router.get('/patients/prac/:practitionerId', mustBePrac, verifyPractitionerOwnership, patientController.getPatientsByPracId);
router.post('/patient', mustBePrac, patientController.createPatient);
router.put('/patient/:patientId', patientController.updatePatient);
router.delete('/patient/:patientId', patientController.deletePatient);
router.post('/patient/login', authController.patientLogin)
module.exports = router;

