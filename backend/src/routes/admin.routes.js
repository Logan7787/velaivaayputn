const express = require('express');
const { getDashboardStats, getAllUsers, toggleUserStatus } = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const router = express.Router();

router.get('/dashboard', authMiddleware, checkRole('ADMIN'), getDashboardStats);
router.get('/users', authMiddleware, checkRole('ADMIN'), getAllUsers);
router.post('/user-status', authMiddleware, checkRole('ADMIN'), toggleUserStatus);

module.exports = router;
