const express = require("express");
const prescriptionController = require("../controllers/prescriptionController");
const { mustBePrac,verifyPractitionerOwnership,mustBePracOrPatient,verifyOwnership } = require("../middleware/authMiddleware");
const { sendEmailToPatient } = require("../middleware/emailMiddleware");
const router = express.Router();
const Prescription = require("../models/prescriptionModel");
const Session = require("../models/sessionModel");

router.post("/prescription", mustBePrac, sendEmailToPatient, prescriptionController.createPrescription);
router.get("/prescriptions", prescriptionController.getPrescriptions);
router.get('/prescription/:prescriptionId', mustBePracOrPatient, verifyOwnership(Prescription, 'prescriptionId'), prescriptionController.getPrescription);
router.get("/prescription/session/:sessionId",mustBePracOrPatient, verifyOwnership(Session, "sessionId"), prescriptionController.getPrescriptionsBySessionId);
router.get("/prescriptions/prac/:pracId", prescriptionController.getPrescriptionsByPracId);
router.get("/prescriptions/patient/:patientId", mustBePracOrPatient, verifyOwnership(Prescription, "patientId"), prescriptionController.getPrescriptionsByPatientId);
router.put("/prescription/:prescriptionId", mustBePrac, verifyPractitionerOwnership, prescriptionController.updatePrescription);
router.delete("/prescription/:prescriptionId", prescriptionController.deletePrescription);

module.exports = router;
