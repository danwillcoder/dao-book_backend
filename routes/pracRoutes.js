const express = require('express');
const pracController = require('../controllers/pracController');
const router = express.Router();
router.get('/pracs', pracController.getPracs);
router.post('/prac', pracController.createPrac);
module.exports = router;

