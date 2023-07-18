const express = require('express');
const sessionController = require('../controllers/sessionController');
const router = express.Router();
router.get('/sessions', sessionController.getSessions);
router.post('/session', sessionController.createSession);
router.get('/sessions/prac/:pracId', sessionController.getSessionsByPracId);
router.get('/sessions/patient/:patientId', sessionController.getSessionsByPatientId);
router.get('/session/:sessionId', sessionController.getSession);
router.put('/session/:sessionId', sessionController.updateSession);
router.delete('/session/:sessionId', sessionController.deleteSession);
module.exports = router;