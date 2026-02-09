const express = require('express');
const { getDashboardStats, getAllUsers, toggleUserStatus, getPendingVerifications, verifyUser } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const router = express.Router();

router.get('/dashboard', authMiddleware, checkRole('ADMIN'), getDashboardStats);
router.get('/users', authMiddleware, checkRole('ADMIN'), getAllUsers);
router.get('/verifications/pending', authMiddleware, checkRole('ADMIN'), getPendingVerifications);
router.patch('/users/:userId/verify', authMiddleware, checkRole('ADMIN'), verifyUser);
router.post('/users/toggle-status', authMiddleware, checkRole('ADMIN'), toggleUserStatus);

module.exports = router;
