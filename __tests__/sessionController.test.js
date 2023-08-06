const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { issuePracToken } = require('../controllers/authController');

const practitionerId = new mongoose.Types.ObjectId();
const patientId = new mongoose.Types.ObjectId();
const prescriptionId = new mongoose.Types.ObjectId();

const practitionerPayload = {
    _id: practitionerId,
    firstName: 'Devan',
    lastName: 'Smith',
    email: 'ds@gmail.com',
    password: 'password',
    ahpraNumber: 'ahpra123',
}

const patientPayload = {
    _id: patientId,
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '01-01-2000',
    email: 'js@gmail.com',
    phoneNumber: '0412345678',
    medications: 'Panadol',
    healthHistory: 'None',
    practitionerId: practitionerId,
    practitionerName: 'Dr. Devan Smith'
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

const sessionPayload = {
    _id: new mongoose.Types.ObjectId(),
    patientId: patientId,
    practitionerId: practitionerId,
    sessionDate: '01-01-2021',
    mainComplaint: 'Main Complaint',
    sessionNotes: 'Session Notes',
    tongue: 'Tongue',
    pulse: 'Pulse'
}

describe('Session Controller Test Suite', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri())

        await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload);
        await mongoose.connection.db.collection('patients').insertOne(patientPayload);
        await mongoose.connection.db.collection('prescriptions').insertOne(prescriptionPayload);
        await mongoose.connection.db.collection('sessions').insertOne(sessionPayload);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close()
    });

    // Test the GET /sessions endpoint
    describe('GET /sessions', () => {
        it('should return all sessions', async () => {
            const response = await supertest(app).get('/sessions')
            expect(response.status).toBe(200);
        })
    })

    // Test the GET /session/:sessionId endpoint
    describe('GET /session/:sessionId', () => {
        it('should return a session by session ID', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).get(`/session/${sessionPayload._id}`).set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
        })
    })

    // Test the POST /session endpoint
    describe('POST /session', () => {
        it('should create a new session', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).post('/session').set('Authorization', `Bearer ${token}`).send({
                patientId: patientId,
                practitionerId: practitionerId,
                sessionDate: '01-01-2021',
                mainComplaint: 'Main Complaint',
                sessionNotes: 'Session Notes',
                tongue: 'Tongue',
                pulse: 'Pulse'
            })
            expect(response.status).toBe(201);
        })
        it('should return a json object with the new session', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).post('/session').set('Authorization', `Bearer ${token}`).send({
                patientId: patientId,
                practitionerId: practitionerId,
                sessionDate: '01-01-2021',
                mainComplaint: 'Main Complaint',
                sessionNotes: 'Session Notes',
                tongue: 'Tongue',
                pulse: 'Pulse'
            })
            expect(response.type).toBe('application/json')
        })
        it('should return a 500 error if no token is provided', async () => {
            const response = await supertest(app).post('/session').send({
                patientId: patientId,
                practitionerId: practitionerId,
                sessionDate: '01-01-2021',
                mainComplaint: 'Main Complaint',
                sessionNotes: 'Session Notes',
                tongue: 'Tongue',
                pulse: 'Pulse'
            })
            expect(response.status).toBe(500);
        })
    })

    
    // Test the PUT /session/:sessionId endpoint
    describe('PUT /session/:sessionId', () => {
        it('should update a session by session ID', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).put(`/session/${sessionPayload._id}`).set('Authorization', `Bearer ${token}`).send({
                patientId: patientId,
                practitionerId: practitionerId,
                sessionDate: '01-01-2021',
                mainComplaint: 'Main Complaint',
                sessionNotes: 'Session Notes',
                tongue: 'Tongue',
                pulse: 'Pulse'
            })
            expect(response.status).toBe(200);
        })
        it('should return a json object with the updated session', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).put(`/session/${sessionPayload._id}`).set('Authorization', `Bearer ${token}`).send({
                patientId: patientId,
                practitionerId: practitionerId,
                sessionDate: '01-01-2021',
                mainComplaint: 'Main Complaint',
                sessionNotes: 'Session Notes',
                tongue: 'Tongue',
                pulse: 'Pulse'
            })
            expect(response.type).toBe('application/json')
        })
        it('should return a 500 error if no token is provided', async () => {
            const response = await supertest(app).put(`/session/${sessionPayload._id}`).send({
                patientId: patientId,
                practitionerId: practitionerId,
                sessionDate: '01-01-2021',
                mainComplaint: 'Main Complaint',
                sessionNotes: 'Session Notes',
                tongue: 'Tongue',
                pulse: 'Pulse'
            })
            expect(response.status).toBe(500);
        })
    })

    
    // Test the DELETE /session/:sessionId endpoint
    describe('DELETE /session/:sessionId', () => {
        it('should delete a session by session ID', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).delete(`/session/${sessionPayload._id}`).set('Authorization', `Bearer ${token}`)
            expect(response.status).toBe(200);
        })
        it('should return a json object with the deleted session', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).delete(`/session/${sessionPayload._id}`).set('Authorization', `Bearer ${token}`)
            expect(response.type).toBe('application/json')
        })
    })
})





