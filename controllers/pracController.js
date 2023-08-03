const Prac = require('../models/pracModel');
const bcrypt = require('bcryptjs');

// Create a new practitioner.

exports.createPrac = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const ahpraNumber = req.body.ahpraNumber;
  
    try {
      // Check if a practitioner with the same email already exists.
      const existingPrac = await Prac.findOne({ email });
  
      if (existingPrac) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password before saving it to the database.
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds.
  
      const prac = new Prac({
        firstName,
        lastName,
        email,
        password: hashedPassword, // Save the hashed password.
        ahpraNumber,
      });
  
      const result = await prac.save();
  
      console.log(result);
      res.status(201).json({
        message: 'Prac created successfully!',
        prac: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };


  // Get all practitioners.
exports.getPracs = (req, res, next) => {
    Prac.find()
        .then(pracs => {
            res.status(200).json({
                message: 'Fetched pracs successfully.',
                pracs: pracs
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Get a single practitioner by ID.
exports.getPrac = (req, res, next) => {
    const pracId = req.params.pracId;
    Prac.findById(pracId)
        .then(prac => {
            if (!prac) {
                const error = new Error('Could not find prac.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'Prac fetched.',
                prac: prac
            });
        })
        .catch(err => {
            console.log(err);
        });
}


// Update a practitioner by ID.
exports.updatePrac = (req, res, next) => {
    const pracId = req.params.pracId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const ahpraNumber = req.body.ahpraNumber;
  
    Prac.findById(pracId)
      .then(prac => {
        if (!prac) {
          const error = new Error('Could not find prac.');
          error.statusCode = 404;
          throw error;
        }
  
        prac.firstName = firstName;
        prac.lastName = lastName;
        prac.email = email;
        prac.ahpraNumber = ahpraNumber;
  
        // Check if a new password is provided and hash it before saving.
        if (password) {
          bcrypt.hash(password, 10)
            .then(hashedPassword => {
              prac.password = hashedPassword;
              return prac.save();
            })
            .then(result => {
              res.status(200).json({
                message: 'Prac updated.',
                prac: result
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ message: 'Server Error' });
            });
        } else {
          // If no new password is provided, save the updated practitioner without changing the password.
          return prac.save()
            .then(result => {
              res.status(200).json({
                message: 'Prac updated.',
                prac: result
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ message: 'Server Error' });
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
      });
  };


// Delete a practitioner by ID.
exports.deletePrac = (req, res, next) => {
    const pracId = req.params.pracId;
    Prac.findByIdAndDelete(pracId)
        .then(prac => {
            if (!prac) {
                const error = new Error('Could not find prac.');
                error.statusCode = 404;
                throw error;
            }

            res.status(200).json({
                message: 'Prac deleted successfully.',
                prac: prac
            });
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};