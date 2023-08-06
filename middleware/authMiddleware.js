const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const Prac = require('../models/pracModel.js');
const Patient = require('../models/patientModel.js');

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


// Practitioner or patient must be logged in before retrieving an object.
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

    // Assuming the object's 'practitionerId' field is available in req.params or req.body, has to also work with Get requests
    const objectPractitionerId = req.body.practitionerId || req.params.practitionerId

    console.log ('loggedPractitionerId', loggedPractitionerId);
    console.log ('objectPractitionerId', objectPractitionerId);

    if (loggedPractitionerId.toString() === objectPractitionerId.toString()) {
        // The logged-in practitioner is the owner of the object
        next();
    } else {
        res.status(401).json({
            message: 'Not authorised.'
        });
    }
});

// Logged in practitioner must be logged in to access his/her own profile. 
const verifyProfileOwnership = asyncHandler(async (req, res, next) => {
    console.log('verifyProfileOwnership middleware running');
    const loggedPractitionerId = req.practitioner._id; // Assuming the logged-in practitioner's _id is available in req.practitioner._id

    let objectPractitionerId;

    // For GET requests, use req.params to access practitionerId
    if (req.method === 'GET' || req.method === 'PUT') {
        objectPractitionerId = req.params.pracId;
    } else if (req.method === 'POST') {
        // For POST requests, use req.body to access practitionerId
        objectPractitionerId = req.body.practitionerId;
    }

    console.log('loggedPractitionerId', loggedPractitionerId);
    console.log('objectPractitionerId', objectPractitionerId);

    if (loggedPractitionerId.toString() === objectPractitionerId.toString()) {
        // The logged-in practitioner is the owner of the object
        next();
    } else {
        res.status(401).json({
            message: 'Not authorised.'
        });
    }
});


// Logged in practitioner's ID must match the practitioner ID of the patient being retrieved.
const verifyPatientsPrac = asyncHandler(async (req, res, next) => {
    console.log('verifyPractitionerOwnership middleware running');

    const loggedPractitionerId = req.practitioner._id;
    const patientId = req.params.patientId;

    try {
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: 'Patient not found.'
            });
        }

        if (patient.practitionerId.toString() !== loggedPractitionerId.toString()) {
            return res.status(401).json({
                message: 'Not authorised.'
            });
        }

        // Ownership verified, proceed to the next middleware/route handler
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});


// Middleware to follow on top of mustBePracOrPatient to check if the logged in user's _id matches the patientId or practitionerId of the object being retrieved.

const verifyOwnership = (Model, idFieldName) => asyncHandler(async (req, res, next) => {
    console.log('verifyOwnership middleware running');

    // Assuming the ID is available in req.params
    const objectId = req.params[idFieldName]

    try {
        // Find the object by ID in the database using the provided model
        const object = await Model.findById(objectId) || await Model.findOne({ _id: objectId }) || await Model.findOne({ [idFieldName]: objectId });
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
                message: 'Not authorised.'
            });
        }
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token or authentication error',
            error: JSON.stringify(error)
        });
    }
});


module.exports = { mustBePrac, verifyPractitionerOwnership, mustBePracOrPatient, verifyOwnership, verifyPatientsPrac, verifyProfileOwnership}





