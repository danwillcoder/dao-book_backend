const express = require('express');
const patientController = require('../controllers/patientController');
const authController = require('../controllers/authController');
const router = express.Router();
router.get('/patients', patientController.getPatients);
router.get('/patient/:patientId', patientController.getPatient);
router.post('/patient', patientController.createPatient);
router.put('/patient/:patientId', patientController.updatePatient);
router.delete('/patient/:patientId', patientController.deletePatient);
router.post('/patient/login', authController.patientLogin)
module.exports = router;

