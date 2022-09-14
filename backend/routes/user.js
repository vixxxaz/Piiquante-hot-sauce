const express = require('express');
const router = express.Router();

const passValid = require('../middleware/password');

const userCtrl = require('../controllers/user');

router.post('/signup', passValid, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;