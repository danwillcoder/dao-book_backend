const mongoose = require('mongoose');
const { sendEmailToPatient } = require('../middleware/emailMiddleware');
const { mockRequest, mockResponse } = require('jest-mock-req-res');
const Patient = require('../models/patientModel');
const Practitioner = require('../models/pracModel');

jest.mock('../email/email');

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

// Mock the models' findById functions
Patient.findById = jest.fn().mockResolvedValue(patientPayload);
Practitioner.findById = jest.fn().mockResolvedValue(practitionerPayload);


describe('sendEmailToPatient', () => {
    beforeEach(() => {
      req.body.patientId = patientId;
      req.body.sendEmail = true;
      req.practitioner = { _id: practitionerId }; // Mock the req.practitioner object
      req.body.formulaName = 'Formula 1';
      req.body.composition = 'Composition 1';
      req.body.dosageAdministration = 'Dosage 1';
      req.body.lifestyleAdvice = 'Advice 1';
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should send an email to the patient when sendEmail is true', async () => {
      await sendEmailToPatient(req, res, jest.fn());
  
      expect(Patient.findById).toHaveBeenCalledTimes(1);
      expect(Practitioner.findById).toHaveBeenCalledTimes(1);
  
      // Assert the email content
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.emailMessage).toBe('Email sent.');
    });
    it('should not send an email when sendEmail is false', async () => {
        req.body.sendEmail = false;
    
        await sendEmailToPatient(req, res, jest.fn());
    
        expect(Patient.findById).toHaveBeenCalledTimes(1);
        expect(Practitioner.findById).toHaveBeenCalledTimes(1);
    
        // Assert the email content
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.emailMessage).toBe('Email not sent.');
      });
})