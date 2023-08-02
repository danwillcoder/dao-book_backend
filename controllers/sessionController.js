const Session = require('../models/sessionModel');


//get all sessions
exports.getSessions = (req, res, next) => {
    Session.find()
        .then(sessions => {
            res.status(200).json({
                message: 'Fetched sessions successfully.',
                sessions: sessions
            });
        })
        .catch(err => {
            console.log(err);
        });
}


//get session by id
exports.getSession = (req, res, next) => {
    const sessionId = req.params.sessionId;
    Session.findById(sessionId)
        .then(session => {
            if (!session) {
                return res.status(404).json({
                    message: 'Session not found.'
                });
            }
            res.status(200).json({
                message: 'Fetched session successfully.',
                session: session
            });
        })
        .catch(err => {
            console.log(err);
        });
}

//get sessions by practitioner id
exports.getSessionsByPracId = (req, res, next) => {
    const pracId = req.params.pracId;
    Session.find({ pracId: pracId })
        .then(sessions => {
            if (!sessions) {
                return res.status(404).json({
                    message: 'Sessions not found.'
                });
            }
            res.status(200).json({
                message: 'Fetched sessions successfully.',
                sessions: sessions
            });
        })
        .catch(err => {
            console.log(err);
        });
}

//get sessions by patient id
exports.getSessionsByPatientId = (req, res, next) => {
    const patientId = req.params.patientId;
    Session.find({ patientId: patientId })
        .then(sessions => {
            if (!sessions) {
                return res.status(404).json({
                    message: 'Sessions not found.'
                });
            }
            res.status(200).json({
                message: 'Fetched sessions successfully.',
                sessions: sessions
            });
        })
        .catch(err => {
            console.log(err);
        });
}

//create session
exports.createSession = (req, res, next) => {
    
        const session = new Session({
            practitionerId: req.practitioner._id,
            patientId: req.body.patientId,
            sessionDate: req.body.sessionDate,
            mainComplaint: req.body.mainComplaint,
            sessionNotes: req.body.sessionNotes,
            tongue: req.body.tongue,
            pulse: req.body.pulse
        });
    
        session.save()
            .then(result => {
                res.status(201).json({
                    message: 'Created session successfully.',
                    session: result
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

//update session by id
exports.updateSession = (req, res, next) => {
    const sessionId = req.params.sessionId;
    Session.findById(sessionId)
        .then(session => {
            if (!session) {
                return res.status(404).json({
                    message: 'Session not found.'
                });
            }
            session.patientId = req.body.patientId;
            session.mainComplaint = req.body.mainComplaint;
            session.sessionNotes = req.body.sessionNotes;
            session.tongue = req.body.tongue;
            session.pulse = req.body.pulse;
            return session.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Session updated.',
                session: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}

//delete session by id
exports.deleteSession = (req, res, next) => {
    const sessionId = req.params.sessionId;
    Session.findById(sessionId)
        .then(session => {
            if (!session) {
                return res.status(404).json({
                    message: 'Session not found.'
                });
            }
            return Session.findByIdAndRemove(sessionId);
        })
        .then(result => {
            res.status(200).json({
                message: 'Session deleted.',
                session: result
            });
        })
        .catch(err => {
            console.log(err);
        });
}