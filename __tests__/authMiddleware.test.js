const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { issuePracToken, issuePatientToken } = require('../controllers/authController');
const { mustBePrac, mustBePracOrPatient, verifyPractitionerOwnership, verifyOwnership, verifyPatientsPrac, verifyProfileOwnership } = require('../middleware/authMiddleware');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

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

    // Test the mustBePrac middleware function

    describe('mustBePrac', () => {
        describe('given a valid request', () => {
            it('should verify the token and call next()', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                await mustBePrac(req, res, () => {
                    expect(req.practitioner).toBeDefined();
                })
            });
        describe('given an invalid request', () => {
            it('should return a 401 status code', async () => {
                const token = await issuePatientToken(patientPayload);
                req.headers = { authorization: `Bearer ${token}` };
                await mustBePrac(req, res, () => {
                    expect(res.status).toHaveBeenCalledWith(401);
                })
            });
        })

    // Test the mustBePracOrPatient middleware function

    describe('mustBePracOrPatient', () => {
        describe('given a valid request', () => {
            it('should verify the token and call next()', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                await mustBePracOrPatient(req, res, () => {
                    console.log(token)
                    expect(req.practitioner).toBeDefined();})
                })
                it('should verify the token and call next()', async () => {
                    const token = await issuePatientToken(patientPayload);
                    req.headers = { authorization: `Bearer ${token}` };
                    await mustBePracOrPatient(req, res, () => {
                        expect(req.patient).toBeDefined();
                })
            });
        })
        describe('given an invalid request', () => {
            it('should return a 401 status code', async () => {
                const token = await issuePracToken('invalid');
                req.headers = { authorization: `Bearer ${token}` };
                await mustBePracOrPatient(req, res, () => {
                    expect(res.status).toHaveBeenCalledWith(401);
                })
            });
        })
    })
    // Test the verifyPractitionerOwnership middleware function
    describe('verifyPractitionerOwnership', () => {
        describe('given a valid request', () => {
            it('should verify the logged-in practitioner ID matches the practitioner ID of the object', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                req.practitioner = {
                    _id: practitionerPayload._id,
                  };
                await verifyPractitionerOwnership(req, res, () => {
                    expect(req.practitioner._id).toEqual(prescriptionPayload.practitionerId);
                })
            });
        describe('given an invalid request', () => {
            it('should return a 401 status code', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                req.practitioner = {
                    _id: 'invalid',
                  };
                await verifyPractitionerOwnership(req, res, () => {
                    expect(res.status).toHaveBeenCalledWith(401);
                })
            });
        })
        })
    })
    // Test the verifyOwnership middleware function
    describe('verifyOwnership', () => {
        describe('given a valid request', () => {
            it('should verify the logged-in practitioner ID matches the practitioner ID of the object', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                req.practitioner = {
                    _id: practitionerPayload._id,
                  };
                await verifyOwnership(req, res, () => {
                    expect(req.practitioner._id).toEqual(prescriptionPayload.practitionerId);
                })
            });
        describe('given an invalid request', () => {
            it('should return a 401 status code', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                req.practitioner = {
                    _id: 'invalid',
                  };
                await verifyOwnership(req, res, () => {
                    expect(res.status).toHaveBeenCalledWith(401);
                })
            });
        })
        // Test the verifyPatientsPrac middleware function

    describe('verifyPatientsPrac', () => {
        describe('given a valid request', () => {
            it('should verify the logged-in practitioner ID is the practitioner of the patient', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                req.practitioner = {
                    _id: practitionerPayload._id,
                  };
                await verifyPatientsPrac(req, res, () => {
                    expect(req.practitioner._id).toEqual(patientPayload.practitionerId);
                })
            });
        })
        describe('given an invalid request', () => {
            it('should return a 401 status code', async () => {
                const token = await issuePracToken(practitionerPayload);
                req.headers = { authorization: `Bearer ${token}` };
                req.practitioner = {
                    _id: 'invalid',
                  };
                await verifyPatientsPrac(req, res, () => {
                    expect(res.status).toHaveBeenCalledWith(401);
                })
            });
        })
        // Test the verifyProfileOwnership middleware function
        describe ('verifyProfileOwnership', () => {
            describe('given a valid request', () => {
                it('should verify the logged-in practitioner ID matches the practitioner ID of his/her own profile', async () => {
                    const token = await issuePracToken(practitionerPayload);
                    req.headers = { authorization: `Bearer ${token}` };
                    req.practitioner = {
                        _id: practitionerPayload._id,
                      };
                    await verifyProfileOwnership(req, res, () => {
                        expect(req.practitioner._id).toEqual(practitionerPayload._id);
                    })
                });
            describe('given an invalid request', () => {
                it('should return a 401 status code', async () => {
                    const token = await issuePracToken(practitionerPayload);
                    req.headers = { authorization: `Bearer ${token}` };
                    req.practitioner = {
                        _id: 'invalid',
                      };
                    await verifyProfileOwnership(req, res, () => {
                        expect(res.status).toHaveBeenCalledWith(401);
                    })
                });
            })
        })
    })
                })
            })
        })

        });
    })
})