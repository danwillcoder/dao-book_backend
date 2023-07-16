const Prac = require('../models/pracModel');

exports.createPrac = (req, res, next) => {
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Email = req.body.Email;
    const Password = req.body.Password;
    const ahpraNumber = req.body.ahpraNumber;

    const prac = new Prac({
        FirstName: FirstName,
        LastName: LastName,
        Email: Email,
        Password: Password,
        ahpraNumber: ahpraNumber
    });
    prac
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Prac created successfully!',
                prac: result
            });
        }
        )
        .catch(err => {
            console.log(err);
        }
        );
};

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