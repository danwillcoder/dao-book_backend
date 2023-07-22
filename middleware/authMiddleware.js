const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const Prac = require('../models/pracModel.js');
const Prescription = require('../models/prescriptionModel.js');
const Session = require('../models/sessionModel.js');
const Patient = require('../models/patientModel.js');

/* 
ENDPOINTS THAT REQUIRE AUTH

Get all patients by PRAC ID (specific PRAC ID)
Get single patient by Patient ID (specific PRAC ID)
Create new patient (general PRAC ID)
Update patient (specific PRAC ID)

Get all prescriptions by Patient ID (specific PRAC ID OR PATIENT ID)
Get prescription by Prescription ID (specific PRAC ID OR PATIENT ID)
Update prescription by Prescription ID (specific PRAC ID)

Get all sessions by Patient ID (specific PRAC ID)
Get session by Session ID (specific PRAC ID)
Create new session (general PRAC ID)
Update session by Session ID (specific PRAC ID)

*/



// Practitioner must be logged in before creating a new object.
const mustBePrac = asyncHandler(async (req, res, next) => {
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

module.exports = mustBePrac, verifyPractitionerOwnership;