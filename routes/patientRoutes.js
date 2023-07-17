const express = require('express');
const patientController = require('../controllers/patientController');
const router = express.Router();
router.get('/patients', patientController.getPatients);
router.get('/patient/:patientId', patientController.getPatient);
router.post('/patient', patientController.createPatient);
router.put('/patient/:patientId', patientController.updatePatient);
router.delete('/patient/:patientId', patientController.deletePatient);
module.exports = router;

