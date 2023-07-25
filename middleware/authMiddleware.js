const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const Prac = require('../models/pracModel.js');
const Prescription = require('../models/prescriptionModel.js');
const Session = require('../models/sessionModel.js');
const Patient = require('../models/patientModel.js');

/* 
ENDPOINTS THAT REQUIRE AUTH


Get single patient by Patient ID (specific PRAC ID)




Get all prescriptions by Patient ID (specific PRAC ID OR PATIENT ID)

Get all sessions by Patient ID (specific PRAC ID)
Get session by Session ID (specific PRAC ID)
Create new session (general PRAC ID)
Update session by Session ID (specific PRAC ID)

DONE
--------------------
Update prescription by Prescription ID (specific PRAC ID)
Get prescription by Prescription ID (specific PRAC ID OR PATIENT ID)

Get all patients by PRAC ID (specific PRAC ID)
Create new patient (general PRAC ID)
Update patient (specific PRAC ID)

*/



// Practitioner must be logged in before creating a new object.
const mustBePrac = asyncHandler(async (req, res, next) => {
    console.log('mustBePrac middleware running');
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const practitioner = await Prac.findById(decoded._id);
    if (practitioner) {
        req.practitioner = practitioner;
        next();
    }
    else {
        res.status(401);
        throw new Error('Not authorised as a practitioner');
    }
});

const mustBePracOrPatient = asyncHandler(async (req, res, next) => {
    console.log('mustBePracOrPatient middleware running');
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const practitioner = await Prac.findById(decoded._id);
    const patient = await Patient.findById(decoded._id);
    if (practitioner || patient) {
        req.practitioner = practitioner;
        req.patient = patient;
        next();
    }
    else {
        res.status(401);
        throw new Error('Not authorised as a practitioner or patient');
    }
});


// Logged in practitioner's ID must match the practitioner ID of the object being updated.
const verifyPractitionerOwnership = asyncHandler(async (req, res, next) => {

    console.log('verifyPractitionerOwnership middleware running');
    const loggedPractitionerId = req.practitioner._id; // Assuming the logged-in practitioner's _id is available in req.practitioner._id

    // Assuming the object's 'practitionerId' field is available in req.params or req.body
    const objectPractitionerId = req.params.practitionerId || req.body.practitionerId;


    if (loggedPractitionerId.toString() === objectPractitionerId.toString()) {
        // The logged-in practitioner is the owner of the object
        next();
    } else {
        res.status(401).json({
            message: 'Not authorized.'
        });
    }
});


// Middleware to follow on top of mustBePracOrPatient to check if the logged in user's _id matches the patientId or practitionerId of the object being retrieved.

const verifyOwnership = (Model, idFieldName) => asyncHandler(async (req, res, next) => {
    console.log('verifyOwnership middleware running');

    // Assuming the ID is available in req.params
    const objectId = req.params[idFieldName];

    try {
        // Find the object by ID in the database using the provided model
        const object = await Model.findById(objectId);

        if (!object) {
            return res.status(404).json({
                message: 'Object not found.'
            });
        }

        // Get the logged-in practitioner's and patient's IDs from the request object
        const loggedPractitionerId = req.practitioner ? req.practitioner._id : null;
        const loggedPatientId = req.patient ? req.patient._id : null;

        // Get the practitionerId and patientId from the object
        const objectPractitionerId = object.practitionerId;
        const objectPatientId = object.patientId;

        console.log('loggedPractitionerId', loggedPractitionerId);
        console.log('loggedPatientId', loggedPatientId);
        console.log('objectPractitionerId', objectPractitionerId);
        console.log('objectPatientId', objectPatientId);

        // Check if the logged-in user's ID matches either the practitionerId or patientId of the object
        if (
            (loggedPractitionerId && loggedPractitionerId.toString() === objectPractitionerId.toString()) ||
            (loggedPatientId && loggedPatientId.toString() === objectPatientId.toString())
        ) {
            // The logged-in user is the owner of the object
            next();
        } else {
            res.status(401).json({
                message: 'Not authorized.'
            });
        }
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token or authentication error'
        });
    }
});


module.exports = { mustBePrac, verifyPractitionerOwnership, mustBePracOrPatient, verifyOwnership }