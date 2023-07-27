const sendEmail = require('../email/email');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel'); // Assuming you have a Patient model

const sendEmailToPatient = asyncHandler(async (req, res) => {
  console.log('sendEmailToPatient running');

  const patientId = req.body.patientId;

  try {
    // Fetch the patient object using the patientId
    const patient = await Patient.findById(patientId);

    if (!patient) {
      // If patient not found, handle the error appropriately
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const email = patient.email;
    const subject = `Your prescription notes from ${new Date(req.body.createdDate).toLocaleDateString()}`;
    const { formulaName, composition, dosageAdministration, lifestyleAdvice } = req.body;

    console.log('email', email);
    console.log('subject', subject);
    console.log('formulaName', formulaName);
    console.log('composition', composition);
    console.log('dosageAdministration', dosageAdministration);
    console.log('lifestyleAdvice', lifestyleAdvice);

    await sendEmail({
      email,
      subject,
      message: `Formula Name: ${formulaName}\nComposition: ${composition}\nDosage Administration: ${dosageAdministration}\nLifestyle Advice: ${lifestyleAdvice}`,
    });

    res.status(200).json({
      message: 'Email sent.',
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({
      message: 'Error sending email.',
    });
  }
});

module.exports = {
  sendEmailToPatient,
};