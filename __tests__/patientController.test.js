const supertest = require('supertest');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Prac = require('../models/pracModel');
const Patient = require('../models/patientModel');
const { issuePracToken } = require('../controllers/authController');


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

        await mongoose.connection.db.collection('patients').insertOne(patientPayload)
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
                console.log('token', token);
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
        })
    })

// testing the GET /patient/:id route

// testing the GET /patients/prac/:practitionerId route

// testing the PUT /patient/:id route

// testing the DELETE /patient/:id route

// testing the POST /patient/login route









    });
});