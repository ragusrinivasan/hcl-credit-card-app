var express = require('express');
var router = express.Router();
const approverController =  require('../controllers/approver.controller.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', approverController.loginApprover);

module.exports = router;
