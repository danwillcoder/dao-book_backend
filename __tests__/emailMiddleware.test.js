// test suits for emailMiddleware.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { sendEmailToPatient } = require('../middleware/emailMiddleware');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const { issuePracToken, issuePatientToken } = require('../controllers/authController');
const { mustBePrac } = require('../middleware/authMiddleware'); // need to import this to mock req.practitioner

// Mock request and response objects
const req = mockRequest();
const res = mockResponse();

const patientId = new mongoose.Types.ObjectId();
const practitionerId = new mongoose.Types.ObjectId();
const prescriptionId = new mongoose.Types.ObjectId();

const patientPayload = {
    _id: patientId,
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date('2000-01-01'),
    email: 'js@gmail.com',
    phoneNumber: '0412345678',
    medications: 'Panadol',
    healthHistory: 'None',
    practitionerId: practitionerId,
    practitionerName: 'Dr. Devan Smith'
}

const practitionerPayload = {
    _id: practitionerId,
    firstName: 'Devan',
    lastName: 'Smith',
    email: 'ds@gmail.com',
    password: 'password',
    ahpraNumber: 'ahpra123',
}

const prescriptionPayload = {
    _id: prescriptionId,
    sessionId: new mongoose.Types.ObjectId(),
    patientId: patientId,
    practitionerId: practitionerId,
    formulaName: 'Formula 1',
    composition: 'Composition 1',
    dosageAdministration: 'Dosage 1',
    lifestyleAdvice: 'Advice 1',
    createdDate: '01-01-2021',
    practitionerName: 'Dr. Devan Smith',
    sendEmail: false
}

describe ('Auth Middleware Test Suite', () => {

    beforeAll(async () => {

    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri())

    await mongoose.connection.db.collection('patients').insertOne(patientPayload);
    await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload);
    await mongoose.connection.db.collection('prescriptions').insertOne(prescriptionPayload);

    });

    afterAll(async () => {

        await mongoose.disconnect();
        await mongoose.connection.close()

    })

    describe('sendEmailToPatient', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code', async () => {
                const practitionerToken = issuePracToken(practitionerPayload);
                req.practitioner = practitionerToken;
                req.body.sendEmail = true;
                req.body.email = 'hello',
                req.body.firstName = 'John',
                req.body.lastName = 'Smith',
                req.body.formulaName = 'Formula 1',
                req.body.composition = 'Composition 1',
                req.body.dosageAdministration = 'Dosage 1',
                req.body.lifestyleAdvice = 'Advice 1',
                req.body.createdDate = '01-01-2021',
                req.body.practitionerName = 'Dr. Devan Smith',
                req.body.patientId = patientId,
                req.body.practitionerId = practitionerId,
                req.body.prescriptionId = prescriptionId,
                req.body.sessionId = new mongoose.Types.ObjectId(),
                req.body.sessionDate = '01-01-2021',
                req.body.mainComplaint = 'Main Complaint',
                req.body.sessionNotes = 'Session Notes',
                req.body.tongue = 'Tongue',
                req.body.pulse = 'Pulse'
                await sendEmailToPatient(req, res);
                expect(res.status).toHaveBeenCalledWith(200);
            })
        })
    })
})