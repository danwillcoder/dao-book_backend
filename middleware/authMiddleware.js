const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const Prac = require('../models/pracModel.js');

const secretKey = process.env.JWT_SECRET;

const protect = asyncHandler(async (req, res, next) => {
    try {
        // Get the token from the request headers or query string (you can choose either way).
        const token = req.headers.authorization || req.query.token;
    
        if (!token) {
          return res.status(401).json({ message: 'Authorization token not found' });
        }
    
        // Verify the token and extract the payload (in this case, it will contain the 'ahpraNumber').
        const decoded = jwt.verify(token, secretKey);
    
        // Find the practitioner using the 'ahpraNumber' from the decoded payload.
        const practitioner = await Prac.findOne({ ahpraNumber: decoded.ahpraNumber });
    
        if (!practitioner) {
          return res.status(401).json({ message: 'Practitioner not found' });
        }
    
        // If the practitioner is found, you can attach the 'practitioner' object to the request for further use in the route handlers.
        req.practitioner = practitioner;
    
        // Continue to the next middleware or the route handler.
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    });
    
    module.exports = protect;