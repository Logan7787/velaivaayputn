const { PrismaClient } = require('@prisma/client');
const { sendBroadcastNotification } = require('../services/notificationService');
const prisma = new PrismaClient();

const createJob = async (req, res) => {
    try {
        const { title, description, companyName, location, district, category, employmentType, experience, salary, skills, contactEmail, contactPhone } = req.body;

        // Check subscription limit
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { subscription: true }
        });

        if (!user.subscription || !user.subscription.isActive) {
            return res.status(403).json({ error: 'No active subscription' });
        }

        if (user.subscription.jobPostsUsed >= user.subscription.jobPostsLimit) {
            return res.status(403).json({ error: 'Job post limit reached. Please upgrade.' });
        }

        // Create Job
        const job = await prisma.job.create({
            data: {
                employerId: req.user.id,
                title,
                description,
                companyName: companyName || user.companyName,
                location,
                district,
                category,
                employmentType,
                experience,
                salary,
                skills: typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills,
                qualifications: [], // Default to empty array as it is required in schema but not in form
                contactEmail,
                contactPhone,
                status: 'ACTIVE',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });

        // Increment usage
        await prisma.subscription.update({
            where: { id: user.subscription.id },
            data: { jobPostsUsed: { increment: 1 } }
        });

        // 🔔 Send OneSignal Notification (Async)
        sendBroadcastNotification(
            'New Job Alert! 🚀',
            `${title} at ${companyName || user.companyName} (${location})`,
            { jobId: job.id, type: 'new_job' }
        ).catch(err => console.error('Notification Error:', err));

        res.status(201).json(job);
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
};

const getJobs = async (req, res) => {
    try {
        const { search, location, category, district } = req.query;

        const where = {
            status: 'ACTIVE'
        };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (location) where.location = { contains: location, mode: 'insensitive' };
        if (district) where.district = { equals: district, mode: 'insensitive' };
        if (category) where.category = category;

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { postedAt: 'desc' },
            include: { employer: { select: { name: true, companyName: true } } }
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: req.params.id },
            include: { employer: { select: { name: true, companyName: true, email: true } } }
        });

        if (!job) return res.status(404).json({ error: 'Job not found' });

        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
};

const getMyJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: { employerId: req.user.id },
            orderBy: { postedAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch your jobs' });
    }
};

const applyForJob = async (req, res) => {
    try {
        const { message } = req.body;
        const jobId = req.params.id;
        const jobSeekerId = req.user.id;

        // Check if already applied
        const existingContact = await prisma.contact.findUnique({
            where: {
                jobId_jobSeekerId: {
                    jobId,
                    jobSeekerId
                }
            }
        });

        if (existingContact) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // Check subscription limits for Job Seeker (Optional, based on requirement)
        // For now, allow free applying or check limit
        const user = await prisma.user.findUnique({
            where: { id: jobSeekerId },
            include: { subscription: true }
        });

        // Create Contact
        const contact = await prisma.contact.create({
            data: {
                jobId,
                jobSeekerId,
                message
            }
        });

        // Update Job application count
        await prisma.job.update({
            where: { id: jobId },
            data: { applicationCount: { increment: 1 } }
        });

        res.status(201).json({ message: 'Application submitted successfully', contact });
    } catch (error) {
        console.error('Apply job error:', error);
        res.status(500).json({ error: 'Failed to apply for job' });
    }
};

const getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Verify job belongs to employer
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.employerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const applications = await prisma.contact.findMany({
            where: { jobId },
            include: {
                jobSeeker: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        skills: true,
                        experience: true,
                        profileImage: true,
                        location: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(applications);
    } catch (error) {
        console.error('Fetch applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Find application
        const application = await prisma.contact.findUnique({
            where: { id: applicationId },
            include: { job: true }
        });

        if (!application) return res.status(404).json({ error: 'Application not found' });

        // Verify authorized
        if (application.job.employerId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this application' });
        }

        const updated = await prisma.contact.update({
            where: { id: applicationId },
            data: { status }
        });

        res.json({ message: 'Status updated successfully', application: updated });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    getMyJobs,
    applyForJob,
    getJobApplications,
    updateApplicationStatus
};
