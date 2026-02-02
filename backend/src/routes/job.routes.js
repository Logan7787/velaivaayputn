const express = require('express');
const { createJob, getJobs, getJobById, getMyJobs } = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck'); // We need to create this

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', authMiddleware, checkRole('EMPLOYER', 'ADMIN'), createJob);
router.get('/my/jobs', authMiddleware, checkRole('EMPLOYER', 'ADMIN'), getMyJobs);

module.exports = router;
