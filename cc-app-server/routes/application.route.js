const express = require('express');
const router = express.Router();
const { submitApplication, getApplicationById } = require('../controllers/application.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST /application - Submit new application
router.post('/application', submitApplication);

// GET /application/:applicationId - Get application by ID
router.get('/application/:applicationId', getApplicationById);

module.exports = router;
