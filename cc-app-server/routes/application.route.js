var express = require('express');
var router = express.Router();
var { getAllApplications } = require('../controllers/application.controller');

/* GET all applications */
router.get('/', getAllApplications);


module.exports = router;
