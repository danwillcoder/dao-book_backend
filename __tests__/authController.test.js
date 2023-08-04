const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { issuePracToken, issuePatientToken } = require('../controllers/authController');

const patientId = new mongoose.Types.ObjectId();
const practitionerId = new mongoose.Types.ObjectId();

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

describe ('Auth Controller Test Suite', () => {

    beforeAll(async () => {

    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri())

    await mongoose.connection.db.collection('patients').insertOne(patientPayload);
    await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload);

    });

    afterAll(async () => {

        await mongoose.disconnect();
        await mongoose.connection.close()

    })

    // Test the POST /prac/register endpoint

    describe('POST /prac', () => {
        describe('given a valid request', () => {
            it('should return a 201 status code', async () => {
                const response = await supertest(app).post('/prac').send({
                    firstName: 'Test',
                    lastName: 'Prac',
                    email: 'testprac@gmail.com',
                    password: 'testpracpassword',
                    ahpraNumber: '123456'
                })
                expect(response.status).toBe(201);
            })
            it('should return a prac object', async () => {
                const response = await supertest(app).post('/prac').send({
                    firstName: 'Test',
                    lastName: 'Prac',
                    email: 'testprac2@gmail.com',
                    password: 'testpracpassword',
                    ahpraNumber: '1234567'
                })
                expect(response.type).toBe('application/json');
            })
        })
    })
    // Test the POST /prac/login endpoint
    describe('POST /prac/login', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code', async () => {
                const response = await supertest(app).post('/prac/login').send({
                    email: 'testprac2@gmail.com',
                    password: 'testpracpassword'
                })
                expect(response.status).toBe(200);
            })
            it('should return a json object with a token', async () => {
                const response = await supertest(app).post('/prac/login').send({
                    email: 'testprac@gmail.com',
                    password: 'testpracpassword'
                })
                expect(response.type).toBe('application/json');
            })
        })
    })
    // Test the POST /patient/login endpoint
    describe('POST /patient/login', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code', async () => {
                const response = await supertest(app).post('/patient/login').send({
                    email: 'js@gmail.com',
                    dateOfBirth: '2000-01-01',
                    lastName: 'Smith'
                })
                expect(response.status).toBe(200);
            })
            it('should return a json object with a token', async () => {
                const response = await supertest(app).post('/patient/login').send({
                    email: 'js@gmail.com',
                    dateOfBirth: '2000-01-01',
                    lastName: 'Smith'
                })
                expect(response.type).toBe('application/json');
            })
        })
    })
    // Test the issuePracToken function
    describe('issuePracToken', () => {
        describe('given a valid request', () => {
            it('should return a token', async () => {
                // pass in the practitionerPayload object
                const token = await issuePracToken(practitionerPayload);
                expect(token).toBeTruthy();
            })
        })
    })
    // Test the issuePatientToken function
    describe('issuePatientToken', () => {
        describe('given a valid request', () => {
            it('should return a token', async () => {
                // pass in the patientPayload object
                const token = await issuePatientToken(patientPayload);
                expect(token).toBeTruthy();
            })
        })
    })
})
