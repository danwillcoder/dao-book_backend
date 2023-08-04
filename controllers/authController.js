const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Prac = require('../models/pracModel');
const Patient = require('../models/patientModel');


const secretKey = process.env.JWT_SECRET;

// Function to issue a JWT token for the authenticated practitioner.
const issuePracToken = (practitioner) => {
  const payload = {
    ahpraNumber: practitioner.ahpraNumber,
    _id: practitioner._id,
  };

  const options = {
    expiresIn: '1h', // Set the expiration time for the token.
  };

  return jwt.sign(payload, secretKey, options);
};

// Login endpoint to authenticate the practitioner and issue a JWT token.
const pracLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the practitioner by email in the database.
    const practitioner = await Prac.findOne({ email });

    if (!practitioner) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database.
    const isPasswordValid = await bcrypt.compare(password, practitioner.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Issue a JWT token and send it in the response.
    const token = issuePracToken(practitioner);

    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Function to issue a JWT token for authenticated patients.
const issuePatientToken = (patient) => {
    const payload = {
      _id: patient._id,
    };
  
    const options = {
      expiresIn: '1h',
    };
  
    return jwt.sign(payload, secretKey, options);
  };

exports.issuePatientToken = issuePatientToken;

// Login endpoint to authenticate the patient and issue a JWT token.

const patientLogin = async (req, res) => {
    const { email, dateOfBirth, lastName } = req.body;
  
    try {
      // Convert the input dateOfBirth string to a date string in 'YYYY-MM-DD' format.
      const formattedDateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0];
  
      // Use MongoDB $expr and $regex operators to perform a partial match on the dateOfBirth field.
      const patient = await Patient.findOne({
        email,
        $expr: {
          $regexMatch: {
            input: { $dateToString: { format: '%Y-%m-%d', date: '$dateOfBirth' } },
            regex: formattedDateOfBirth,
            options: 'i', // 'i' for case-insensitive matching
          },
        },
        lastName,
      });
  
      if (!patient) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // If the patient is found, create a JWT token and send it in the response.
      const token = issuePatientToken(patient);
  
      res.json({ token });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };


  module.exports = {  issuePatientToken, issuePracToken, pracLogin, patientLogin };