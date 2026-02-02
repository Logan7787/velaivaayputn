const express = require('express');
const { initiateUpgrade, verifyUpgrade } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/upgrade', authMiddleware, initiateUpgrade);
router.post('/verify', authMiddleware, verifyUpgrade);

module.exports = router;
