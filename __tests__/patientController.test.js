const supertest = require('supertest');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { issuePracToken } = require('../controllers/authController');
const Prac = require('../models/pracModel');
const Patient = require('../models/patientModel');

const patientId = new mongoose.Types.ObjectId();
const practitionerId = new mongoose.Types.ObjectId();

const patientPayload = {
    _id: patientId,
    firstName: 'John',
    lastName: 'Smith',
    dob: '01/01/2000',
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
    ahpraNumber: 'aphra123',

}



describe('Test patient routes', () => {
    beforeAll(async () => {

        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri())

        await mongoose.connection.db.collection('patient').insertOne(patientPayload)
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close()
    })

// testing the GET /patients route
    describe('GET /patients', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code and all patients', async () => {
                
                const response = await supertest(app).get('/patients');
                expect(response.statusCode).toBe(200);
            });
            it('should return patients in an json object', async () => {
                const response = await supertest(app).get('/patients');
                expect(response.type).toBe('application/json');
            }
        );
        });
        describe('given an invalid request', () => {
            it('should return a 404 status code', async () => {
                const response = await supertest(app).get('/patient');
                expect(response.statusCode).toBe(404);
        });
        })

    });
});