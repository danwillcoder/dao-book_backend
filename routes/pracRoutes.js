const express = require('express');
const pracController = require('../controllers/pracController');
const router = express.Router();
router.get('/pracs', pracController.getPracs);
router.get('/prac/:pracId', pracController.getPrac);
router.post('/prac', pracController.createPrac);
router.put('/prac/:pracId', pracController.updatePrac);
router.delete('/prac/:pracId', pracController.deletePrac);
module.exports = router;

