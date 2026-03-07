const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { verifyUser } = require('../controllers/authController');

router.get('/verify', auth, verifyUser);

module.exports = router;
