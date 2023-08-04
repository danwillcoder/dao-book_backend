const supertest = require('supertest');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Prac = require('../models/pracModel');
const { issuePracToken } = require('../controllers/authController');
const bcrypt = require('bcryptjs');

const practitionerId = new mongoose.Types.ObjectId();
const practitionerId2 = new mongoose.Types.ObjectId();
const practitionerId3 = new mongoose.Types.ObjectId();

const practitionerPayload = {
    _id: practitionerId,
    firstName: 'Devan',
    lastName: 'Smith',
    email: 'ds@gmail.com',
    password: 'password',
    ahpraNumber: 'ahpra123',
}

const practitionerPayload2 = new Prac({
    _id: practitionerId2,
    firstName: 'Jill',
    lastName: 'Drake',
    email: 'jilldrake@gmail.com',
    password: 'password',
    ahpraNumber: 'ahpra129'
});

const practitionerPayload3 = new Prac({
    _id: practitionerId3,
    firstName: 'Sam',
    lastName: 'Unicorn',
    email: 'samu@gmail.com',
    password: 'password',
    ahpraNumber: 'ahpra130'
});

describe('Test prac routes', () => {
    beforeAll(async () => {

        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri())

        await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload)
        await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload2)
        await mongoose.connection.db.collection('pracs').insertOne(practitionerPayload3)
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
        describe('GET /prac/:pracId', () => {
            describe('given a valid request', () => {
                it('should return a 200 status code', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).get(`/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`);
                    expect(response.statusCode).toBe(200);
                });
                it('should return the prac in a json object', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).get(`/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`);
                    expect(response.body).toEqual(expect.any(Object));
                });
                it('should return the prac with the correct id', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).get(`/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`);
                    expect(response.body.prac._id).toBe(practitionerId.toString());
                })
            })
            describe('given an invalid request', () => {
                it('should return a 401 status code', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).get(`/prac/22lk3j4l34kj34`).set('Authorization', `Bearer ${token}`);
                    console.log(response.body);
                    expect(response.statusCode).toBe(401);
                })
                it('should return an error message', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).get(`/prac/22lk3j4l34kj34`).set('Authorization', `Bearer ${token}`);
                    expect(response.body.message).toBe('Not authorised.')
                })
            })
        })

// testing the PUT /prac/:pracId route
        describe('PUT /prac/:pracId', () => {
            describe('given a valid request', () => {
                it('should return a 200 status code', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).put(`/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`).send({
                        firstName: 'Devan',
                        lastName: 'Smith',
                        email: 'ds4@gmail.com',
                        password: 'password',
                        ahpraNumber: 'aphra123'
                    });
                    expect(response.statusCode).toBe(200);
                });
                it('should return the updated prac in a json object', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).put(`/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`).send({
                        firstName: 'Devan',
                        lastName: 'Smith',
                        email: 'ds4@gmail.com',
                        password: 'password',
                        ahpraNumber: 'aphra123'
                    });
                    expect(response.body).toEqual(expect.any(Object));
                });
            })
            describe('given an invalid request', () => {
                it('should return a 401 status code', async () => {
                const token = issuePracToken(practitionerPayload);
                const response = await supertest(app).put(`/prac/${'dk234j23lj234'}`).set('Authorization', `Bearer ${token}`).send({
                    firstName: 'Devan',
                    lastName: 'Smith',
                    email: 'ds4@gmail.com',
                    password: 'password',
                    ahpraNumber: 'aphra123'
                });
                expect(response.statusCode).toBe(401);
            })
        })
        })

// testing the DELETE /prac/:pracId route
        describe('DELETE /prac/:pracId', () => {
            describe('given a valid request', () => {
                it('should return a 200 status code', async () => {
                    const token = issuePracToken(practitionerPayload);
                    const response = await supertest(app).delete(`/prac/${practitionerId}`).set('Authorization', `Bearer ${token}`);
                    expect(response.statusCode).toBe(200);
                });
                it('should return a message', async () => {

                    const token = issuePracToken(practitionerPayload2);
                    const response = await supertest(app).delete(`/prac/${practitionerId2}`).set('Authorization', `Bearer ${token}`);
                    expect(response.body.message).toBe('Prac deleted successfully.');
                });
            })
            describe('given an invalid request', () => {
                describe('given an invalid request', () => {
                    it ('should return a 404 status code', async () => {
                        const token = issuePracToken(practitionerPayload3);
                        const response = await supertest(app).delete(`/prac/${practitionerId2}`).set('Authorization', `Bearer ${token}`);
                        console.log(response.body)
                        expect(response.statusCode).toBe(404);
                    })
                    it ('should return an error message', async () => {
                        const token = issuePracToken(practitionerPayload3);
                        const response = await supertest(app).delete(`/prac/${practitionerId2}`).set('Authorization', `Bearer ${token}`);
                        expect(response.body.message).toBe('Could not find prac.')
                    })
                })
            })
            // testing the POST /prac/login route
            describe('POST /prac/login', () => {
                describe('given a valid request', () => {
                    it('should return a 200 status code', async () => {
                        // Hash the password before saving the Prac object
                        const hashedPassword = await bcrypt.hash('password', 10);
                        prac4 = await new Prac({
                          firstName: 'Peter',
                          lastName: 'Marvin',
                          email: 'pete@gmail.com',
                          password: hashedPassword, // Save the hashed password
                          ahpraNumber: 'ahpra131'
                        });
                        await prac4.save();
                        const response = await supertest(app).post('/prac/login').send({
                            email: 'pete@gmail.com',
                            password: 'password'
                        })
                        expect(response.statusCode).toBe(200);
                    });
                    it('should return a token', async () => {
                        const hashedPassword = await bcrypt.hash('password', 10); 
                        prac5 = await new Prac({
                            firstName: 'Tony',
                            lastName: 'Stark',
                            email: 'ts@gmail.com',
                            password: hashedPassword,
                            ahpraNumber: 'ahpra132'
                        });
                        await prac5.save();
                        const response = await supertest(app).post('/prac/login').send({
                            email: 'ts@gmail.com',
                            password: 'password'
                        })
                        expect(response.body.token).toEqual(expect.any(String));
                    });
                })
                describe('given an invalid request', () => {
                    it('should return a 401 status code', async () => {
                        const response = await supertest(app).post('/prac/login').send({
                            email: 'invalidemail@gmail.com',
                            password: 'password'
                        })
                        expect(response.statusCode).toBe(401);
                    })
                })
            })
})


})

});
})

