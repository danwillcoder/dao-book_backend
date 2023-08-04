const supertest = require('supertest');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Prac = require('../models/pracModel');

describe('Test prac routes', () => {
    beforeAll(async () => {

        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri())

    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close()
    })
    // testing the GET /pracs route
    describe('GET /pracs', () => {
        describe('given a valid request', () => {
            it('should return a 200 status code and all pracs', async () => {
                
                const response = await supertest(app).get('/pracs');
                expect(response.statusCode).toBe(200);
            });
            it('should return pracs in a json object', async () => {
                const response = await supertest(app).get('/pracs');
                expect(response.body).toEqual(expect.any(Object));
            });

        describe('given an invalid request', () => {
            it('should return a 404 status code', async () => {
                const response = await supertest(app).get('/prac');
                expect(response.statusCode).toBe(404);
            })
        });
    });
    // testing the POST /prac route
    describe('POST /prac', () => {
        describe('given a valid request', () => {
            it('should return a 201 status code', async () => {
                const response = await supertest(app).post('/prac').send({
                    firstName: 'Devan',
                    lastName: 'Smith',
                    email: 'devansmith@gmail.com',
                    password: 'password',
                    ahpraNumber: 'aphra123'
                });
                expect(response.statusCode).toBe(201);
            });
            it('should return the created prac in an json object', async () => {
                const response = await supertest(app).post('/prac').send({
                    firstName: 'Devan',
                    lastName: 'Smith',
                    email: 'devansmith@gmail.com',
                    password: 'password',
                    ahpraNumber: 'aphra123'
                });
                expect(response.body).toEqual(expect.any(Object));
            });
        });
        describe('given email already registered', () => {
            it('should return a 400 status code', async () => {
                const response = await supertest(app).post('/prac').send({
                    firstName: 'Devan',
                    lastName: 'Smith',
                    email: 'devansmith@gmail.com',
                    password: 'password',
                    ahpraNumber: 'dfjke'
                })
                expect(response.statusCode).toBe(400);

            });
        })

// testing the GET /prac/:pracId route

// testing the PUT /prac/:pracId route

// testing the DELETE /prac/:pracId route



    })

});
})

