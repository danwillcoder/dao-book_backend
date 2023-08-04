const supertest = require('supertest');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Prac = require('../models/pracModel');
const Patient = require('../models/patientModel');
const { issuePracToken } = require('../controllers/authController');


const patientId = new mongoose.Types.ObjectId();
const practitionerId = new mongoose.Types.ObjectId();
const patientId2 = new mongoose.Types.ObjectId();

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

const patientPayload2 = {
    _id: patientId2,
    firstName: 'Dave',
    lastName: 'Logan',
    dateOfBirth: '01-01-2000',
    email: 'davel@gmail.com',
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

        await mongoose.connection.db.collection('patients').insertOne(patientPayload)
        await mongoose.connection.db.collection('patients').insertOne(patientPayload2)
        await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload)

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


// testing the POST /patient route
    describe('POST /patient', () => {
        describe('given a valid request', () => {
            it('should return a 201 status code', async () => {
                const token = issuePracToken(practitionerPayload);
                // Make the POST request and set the JWT token in the Authorization header
                const response = await supertest(app)
                  .post('/patient')
                  .send({
                    firstName: 'John',
                    lastName: 'Smith',
                    dob: '01/01/2000',
                    email: 'johnsmith@gmail.com',
                    phoneNumber: '0412345678',
                    medications: 'Panadol',
                    healthHistory: 'None',
                    practitionerId: practitionerId,
                    practitionerName: 'Dr. Devan Smith',
                  })
                  .set('Authorization', `Bearer ${token}`); // Set the JWT token in the Authorization header
                expect(response.statusCode).toBe(201);     
            });
            it ('should return the created patient in a json object', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).post('/patient').send({
                    firstName: 'John',
                    lastName: 'Smithson',
                    dob: '01/01/2000',
                    email: 'johnsmithson@gmail.com',
                    phoneNumber: '0412345678',
                    medications: 'Panadol',
                    healthHistory: 'None',
                    practitionerId: practitionerId,
                    practitionerName: 'Dr. Devan Smith'
                    
                })
                .set('Authorization', `Bearer ${token}`);
                expect(response.type).toBe('application/json');
            })
            // test if patient already exists
            it('should return a 403 status code if patient already exists', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).post('/patient').send({
                    firstName: 'John',
                    lastName: 'Smith',
                    dob: '01/01/2000',
                    email: 'johnsmith@gmail.com',
                    phoneNumber: '0412345678',
                    medications: 'Panadol',
                    healthHistory: 'None',
                    practitionerId: practitionerId,
                    practitionerName: 'Dr. Devan Smith'
        })
        .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(403);
        });
    })
})

// testing the GET /patient/:id route
    describe('GET /patient/:id', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code and the patient', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patient/${patientId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(200);
            });
            it('should return the patient in a json object', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patient/${patientId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.type).toBe('application/json');
            })
            it('should return the correct patient', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patient/${patientId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.body.patient.firstName).toBe('John');
            })
            it('should return a 404 status code if patient does not exist', async () => {
                const patientId = new mongoose.Types.ObjectId();
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patient/${patientId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(404);
            })

        })
    })

// testing the GET /patients/prac/:practitionerId route
    describe('GET /patients/prac/:practitionerId', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code and all patients for the practitioner', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patients/prac/${practitionerId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(200);
            });
            it('should return patients in a json object', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patients/prac/${practitionerId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.type).toBe('application/json');
            })
            it('should return the correct patients', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patients/prac/${practitionerId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.body.patients[0].firstName).toBe('John');
            })
        })
        describe('given an invalid request', () => {
            it('should return a 401 if unauthorised', async () => {
                const practitionerId = new mongoose.Types.ObjectId();
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).get(`/patients/prac/${practitionerId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(401);
            })
        })
    })

// testing the PUT /patient/:id route
    describe('PUT /patient/:id', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code and the updated patient', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).put(`/patient/${patientId}`).send({
                    firstName: 'John',
                    lastName: 'Smith',
                    dob: '01/01/2000',
                    email: 'johnsmith32@gmail.com',
                    phoneNumber: '0412345678',
                    medications: 'Panadol',
                    healthHistory: 'None',
                    practitionerId: practitionerId,
                    practitionerName: 'Dr. Devan Smith'
                })
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(200);
            });
            it('should return the updated patient in a json object', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).put(`/patient/${patientId}`).send({
                    firstName: 'John',
                    lastName: 'Smith',
                    dob: '01/01/2000',
                    email: 'johnsmith32@gmail.com',
                    phoneNumber: '0412345678',
                    medications: 'Panadol',
                    healthHistory: 'None',
                    practitionerId: practitionerId,
                    practitionerName: 'Dr. Devan Smith'
                })
                .set('Authorization', `Bearer ${token}`);
                expect(response.type).toBe('application/json');
            })
        })
        describe('given an invalid request', () => {
            it('should return a 401 if unauthorised', async () => {
                newPrac = new Prac({
                    firstName: 'Dylan',
                    lastName: 'Smog',
                    email: 'dylsa@gmail.com',
                    password: 'password',
                    ahpraNumber: 'aphra124'
                });
                await newPrac.save();
                const token = issuePracToken(newPrac);
                const response = await supertest(app).put(`/patient/${patientId}`).send({
                    firstName: 'John',
                    lastName: 'Smith',
                    dob: '01/01/2000',
                    email: 'johnsmith32@gmail.com',
                    phoneNumber: '0412345678',
                    medications: 'Panadol',
                    healthHistory: 'None',
                    practitionerId: practitionerId,
                    practitionerName: 'Dr. Devan Smith'
                })
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(401);
            })
        })
    })

// testing the DELETE /patient/:id route
    describe('DELETE /patient/:id', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code and the deleted patient', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).delete(`/patient/${patientId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(200);
            });
            it('should return the deleted patient in a json object', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).delete(`/patient/${patientId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.type).toBe('application/json');
            })
        })
        describe('given an invalid request', () => {
            it('should return a 404 if patient does not exist', async () => {
                const patientId = new mongoose.Types.ObjectId();
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).delete(`/patient/${patientId}`)
                .set('Authorization', `Bearer ${token}`);
                expect(response.statusCode).toBe(404);
            })
        })
})

// testing the POST /patient/login route, the patient must provide their email, date of birth and last name to login

describe('POST /patient/login', () => {
    describe('given a valid request', () => {
        it('should return a 200 status code', async () => {
            // create a new patient to login
            const patient3 = new Patient({ 
                firstName: 'Sam',
                lastName: 'Smith',
                dateOfBirth: '01/01/2000',
                email: 'samsmith@gmail.com',
                phoneNumber: '0412345678',
                medications: 'Panadol',
                healthHistory: 'None',
                practitionerId: practitionerId,
                practitionerName: 'Dr. Devan Smith'
            });
            await patient3.save();
            const response = await supertest(app).post('/patient/login').send({
                email: 'samsmith@gmail.com',
                dateOfBirth: '01/01/2000',
                lastName: 'Smith'
            });
            expect(response.statusCode).toBe(200);
        });
        it('should return a jwt key in a json object', async () => {
            const patient4 = new Patient({ 
                firstName: 'Sam',
                lastName: 'Smith',
                dateOfBirth: '01/01/2000',
                email: 'samsmith4@gmail.com',
                phoneNumber: '0412345678',
                medications: 'Panadol',
                healthHistory: 'None',
                practitionerId: practitionerId,
                practitionerName: 'Dr. Devan Smith'
            });
            await patient4.save();
            const response = await supertest(app).post('/patient/login').send({
                email: 'samsmith4@gmail.com',
                dateOfBirth: '01/01/2000',
                lastName: 'Smith'
            })
            expect(response.type).toBe('application/json');
        })
    });
});
});
});