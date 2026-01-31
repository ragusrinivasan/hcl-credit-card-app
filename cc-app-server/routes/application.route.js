var express = require('express');
var router = express.Router();
const applicationController = require('../controllers/application.controller');
const authenticate = require('../middlewares/authenticate.middleware');

/* GET all applications */
router.get('/', authenticate, applicationController.getAllApplications);
module.exports = router;
