var express = require('express');
var router = express.Router();
const  applicationController  = require('../controllers/application.controller');

/* GET all applications */
router.get('/', applicationController.getAllApplications);
module.exports = router;
