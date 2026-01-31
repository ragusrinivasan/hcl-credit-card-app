var express = require('express');
var router = express.Router();
const applicationController = require('../controllers/application.controller');
const authenticate = require('../middlewares/authenticate.middleware');

/* GET all applications */
router.get('/fetch-ind/:id', authenticate, applicationController.getApplicationById);
router.get('/fetch-ui/:id', applicationController.getApplicationByIdUnprotected);
router.get('/fetch', authenticate, applicationController.getAllApplications);

/* PATCH update application status */
router.put('/:applicationNumber/status', authenticate, applicationController.updateApplicationStatus);

// GET /application/:id - Get application by ID
// router.get('/application/:id', applicationController.getApplicationById);

module.exports = router;
