var express = require('express');
var router = express.Router();
const trackingController = require('../controllers/tracking.controller');

/* GET all Status */
router.get('/fetchstatus', trackingController.getTrackingstatus);
module.exports = router;
