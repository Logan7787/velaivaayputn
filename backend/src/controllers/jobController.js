const { PrismaClient } = require('@prisma/client');
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
                skills,
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

module.exports = {
    createJob,
    getJobs,
    getJobById,
    getMyJobs
};
