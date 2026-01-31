var express = require('express');
var router = express.Router();
var { getAllApplications } = require('../controllers/application.controller');

/* GET all applications */
router.get('/applications', getAllApplications);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
