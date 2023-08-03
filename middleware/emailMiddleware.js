const sendEmail = require('../email/email');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel'); 
const Practitioner = require('../models/pracModel'); 


// Send an email to the patient.
const sendEmailToPatient = asyncHandler(async (req, res, next) => {
  console.log('sendEmailToPatient running');

  const patientId = req.body.patientId;
  const sendEmailBoolean = req.body.sendEmail;
  const practitionerId = req.practitioner._id;

  try {
    // Fetch the patient object using the patientId
    const patient = await Patient.findById(patientId);
    const practitioner = await Practitioner.findById(practitionerId)

    if (!patient) {
      // If patient not found, handle the error appropriately
      return res.status(404).json({ message: 'Patient not found.' });
    }

    const email = patient.email;
    const date = new Date().toLocaleDateString('en-GB');
    const firstName = patient.firstName; // Access the patient's first name
    const pracName = patient.practitionerName; // Access the patient's practitioner's name
    const pracEmail = practitioner.email; // Access the practitioner's email
    console.log('pracName', pracName);
    console.log('pracEmail', pracEmail);
    console.log('sendEmail', req.body.sendEmail)

    const subject = `Your prescription notes from ${date}`;
    const { formulaName, composition, dosageAdministration, lifestyleAdvice } = req.body;

    console.log('email', email);
    console.log('subject', subject);
    console.log('formulaName', formulaName);
    console.log('composition', composition);
    console.log('dosageAdministration', dosageAdministration);
    console.log('lifestyleAdvice', lifestyleAdvice);

    if (sendEmailBoolean) {
      // If sendEmail is true, trigger the email sending process
      await sendEmail({
        email,
        subject,
        from: `${pracName} <${process.env.EMAIL_FROM}>`,
        message: `Hi ${firstName},\n\nHere is your prescription information from today's session. If you have any further questions, please don't hesitate to reach out. \n\nFormula Name: ${formulaName}\nComposition: ${composition}\nDosage & Administration: ${dosageAdministration}\nLifestyle Advice: ${lifestyleAdvice}\n\nKind regards,\n${pracName}\n${pracEmail}`,
      });

      res.status(200);
      res.emailMessage = 'Email sent.';
    } else {
      console.log('sendEmailBoolean is false');
      res.status(200);
      res.emailMessage = 'Email not sent.';
      }

      next()
      // Add a return statement here to prevent further code execution
      return;
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