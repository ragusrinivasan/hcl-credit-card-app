var express = require('express');
var router = express.Router();
const applicationController = require('../controllers/application.controller');
const authenticate = require('../middlewares/authenticate.middleware');

/* GET all applications */
router.get('/fetch/:id', authenticate, applicationController.getApplicationById);
router.get('/fetch-ui/:id', applicationController.getApplicationById);
router.get('/fetch', authenticate, applicationController.getAllApplications);

/* PATCH update application status */
router.put('/:applicationNumber/status', authenticate, applicationController.updateApplicationStatus);

module.exports = router;
