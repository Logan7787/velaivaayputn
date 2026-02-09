const express = require('express');
const { createJob, getJobs, getJobById, getMyJobs, applyForJob, getJobApplications } = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck'); // We need to create this

const router = express.Router();

// Protected routes
router.get('/my/jobs', authMiddleware, checkRole('EMPLOYER', 'ADMIN'), getMyJobs);
router.post('/', authMiddleware, checkRole('EMPLOYER', 'ADMIN'), createJob);
router.post('/:id/apply', authMiddleware, checkRole('JOBSEEKER'), require('../controllers/jobController').applyForJob);
router.get('/:id/applications', authMiddleware, checkRole('EMPLOYER', 'ADMIN'), require('../controllers/jobController').getJobApplications);

// Public routes (generic ones last)
router.get('/', getJobs);
router.get('/:id', getJobById);

module.exports = router;
