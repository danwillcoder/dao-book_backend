const express = require('express');
const pracController = require('../controllers/pracController');
const authController = require('../controllers/authController');
const router = express.Router();
const { mustBePrac, verifyProfileOwnership } = require('../middleware/authMiddleware');
router.get('/pracs', pracController.getPracs);
router.get('/prac/:pracId', mustBePrac, verifyProfileOwnership, pracController.getPrac);
router.post('/prac', pracController.createPrac);
router.put('/prac/:pracId', mustBePrac, verifyProfileOwnership, pracController.updatePrac);
router.delete('/prac/:pracId', pracController.deletePrac);
router.post('/prac/login', authController.pracLogin);

module.exports = router;




