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

exports.updatePrac = (req, res, next) => {
    const pracId = req.params.pracId;
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Email = req.body.Email;
    const Password = req.body.Password;
    const ahpraNumber = req.body.ahpraNumber;

    Prac.findById(pracId)
        .then(prac => {
            if (!prac) {
                const error = new Error('Could not find prac.');
                error.statusCode = 404;
                throw error;
            }
            prac.FirstName = FirstName;
            prac.LastName = LastName;
            prac.Email = Email;
            prac.Password = Password;
            prac.ahpraNumber = ahpraNumber;
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
        });
}

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