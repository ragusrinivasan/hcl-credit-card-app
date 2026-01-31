var express = require('express');
var router = express.Router();
var Application = require('../models/application.model');

/* GET all applications */
router.get('/applications', async function (req, res, next) {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message,
        });
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
