var express = require('express');
var router = express.Router();
const approverController =  require('../controllers/approver.controller.js');
/* GET users listing. */

router.post('/login', approverController.loginApprover);

module.exports = router;
