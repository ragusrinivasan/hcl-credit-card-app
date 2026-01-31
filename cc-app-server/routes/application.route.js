var express = require('express');
var router = express.Router();
const applicationController = require('../controllers/application.controller');
const authenticate = require('../middlewares/authenticate.middleware');

/* GET all applications */
router.get('/fetch', authenticate, applicationController.getAllApplications);
router.get('/fetch/:id', authenticate, applicationController.getApplicationById);
module.exports = router;
