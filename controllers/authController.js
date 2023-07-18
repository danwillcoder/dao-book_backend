const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Prac = require('../models/pracModel');

// Your secret key for JWT token signing. Make sure to keep this secret.
const secretKey = process.env.JWT_SECRET;

// Function to issue a JWT token for the authenticated practitioner.
const issueToken = (practitioner) => {
  const payload = {
    ahpraNumber: practitioner.ahpraNumber,
  };

  const options = {
    expiresIn: '1h', // Set the expiration time for the token.
  };

  return jwt.sign(payload, secretKey, options);
};

// Login endpoint to authenticate the practitioner and issue a JWT token.
exports.login = async (req, res) => {
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
    const token = issueToken(practitioner);

    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

