const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { issuePracToken, issuePatientToken } = require('../controllers/authController');

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

describe('Prescription Controller Test Suite', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri())

        await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload);
        await mongoose.connection.db.collection('patients').insertOne(patientPayload);
        await mongoose.connection.db.collection('prescriptions').insertOne(prescriptionPayload);
    });


    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close()
    });

    // Test the GET /prescriptions endpoint.
    describe('GET /prescriptions', () => {
        describe('given a valid request', () => {
        it('should return all prescriptions', async () => {
            const response = await supertest(app).get('/prescriptions');
            expect(response.status).toBe(200);
        })
        it('should return a JSON object', async () => {
            const response = await supertest(app).get('/prescriptions');
            expect(response.type).toBe('application/json');
        })
    })
})

// Test the GET /prescription/:id endpoint.
    describe('GET /prescription/:id', () => {
        describe('given a valid request', () => {
        it('should return a prescription', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).get(`/prescription/${prescriptionId}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        })
        it('should return a JSON object', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).get(`/prescription/${prescriptionId}`).set('Authorization', `Bearer ${token}`);
            expect(response.type).toBe('application/json');
        })
    })
    describe('given an invalid request', () => {
        it('should return a 401 error', async () => {
            const token = issuePatientToken(patientPayload);
            const response = await supertest(app).get(`/prescription/${'aflj32l324'}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(401);
        })
        it('should return a JSON object', async () => {
            const response = await supertest(app).get(`/prescription/${prescriptionId}`);
            expect(response.type).toBe('application/json');
        })
    })
})

// Test the GET /prescriptions/patient/:id endpoint.
    describe ('GET /prescriptions/patient/:id', () => {
        describe('given a valid request', () => {
        it('should return all prescriptions for a patient', async () => {
            const token = issuePatientToken(patientPayload);
            const response = await supertest(app).get(`/prescriptions/patient/${patientId}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        })
        it('should return a JSON object', async () => {
            const token = issuePatientToken(patientPayload);
            const response = await supertest(app).get(`/prescriptions/patient/${patientId}`).set('Authorization', `Bearer ${token}`);
            expect(response.type).toBe('application/json');
        })
    })
})

// Test the GET /prescriptions/prac/:id endpoint.
    describe ('GET /prescriptions/prac/:id', () => {
        describe('given a valid request', () => {
        it('should return all prescriptions for a practitioner', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).get(`/prescriptions/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        })
        it('should return a JSON object', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).get(`/prescriptions/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`);
            expect(response.type).toBe('application/json');
        })
    })
})

// Test the POST /prescriptions endpoint.
    describe ('POST /prescription', () => {
        describe('given a valid request', () => {
        it('should create a new prescription', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).post(`/prescription`).set('Authorization', `Bearer ${token}`).send({
                sessionId: new mongoose.Types.ObjectId(),
                patientId: patientId,
                practitionerId: practitionerId,
                formulaName: 'Formula 2',
                composition: 'Composition 2',
                dosageAdministration: 'Dosage 2',
                lifestyleAdvice: 'Advice 2',
                createdDate: '01-01-2021',
                practitionerName: 'Dr. Devan Smith',
                sendEmail: false
            });
            expect(response.status).toBe(201);
        })
        it('should return a JSON object', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).post(`/prescription`).set('Authorization', `Bearer ${token}`).send({
                sessionId: new mongoose.Types.ObjectId(),
                patientId: patientId,
                practitionerId: practitionerId,
                formulaName: 'Formula 2',
                composition: 'Composition 2',
                dosageAdministration: 'Dosage 2',
                lifestyleAdvice: 'Advice 2',
                createdDate: '01-01-2021',
                practitionerName: 'Dr. Devan Smith',
                sendEmail: false
            });
            expect(response.type).toBe('application/json');
        })
    })
})
// Test the PUT /prescription/:id endpoint.
    describe ('PUT /prescription/:id', () => {
        describe('given a valid request', () => {
        it('should update a prescription', async () => {
            const token = issuePracToken(practitionerPayload);
            const response = await supertest(app).put(`/prescription/${prescriptionId}`).set('Authorization', `Bearer ${token}`).send({
                sessionId: new mongoose.Types.ObjectId(),
                patientId: patientId,
                practitionerId: practitionerId,
                formulaName: 'Formula Updated',
                composition: 'Composition Updated',
                dosageAdministration: 'Dosage 2',
                lifestyleAdvice: 'Advice Updated',
                createdDate: '01-01-2021',
                practitionerName: 'Dr. Devan Smith',
                sendEmail: false
            });
            expect(response.status).toBe(200);
        })
    })
})
// Test the DELETE /prescription/:id endpoint

    describe ('DELETE /prescription/:id', () => {
        describe('given a valid request', () => {
            it('should delete a prescription', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).delete(`/prescription/${prescriptionId}`).set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            })
        })
    })


})

