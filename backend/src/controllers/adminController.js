const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const employers = await prisma.user.count({ where: { role: 'EMPLOYER' } });
        const jobSeekers = await prisma.user.count({ where: { role: 'JOBSEEKER' } });
        const totalJobs = await prisma.job.count();
        const activeJobs = await prisma.job.count({ where: { status: 'ACTIVE' } });
        const pendingVerifications = await prisma.user.count({ where: { role: 'EMPLOYER', isVerified: false } });

        // Growth Analytics (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentUsers = await prisma.user.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        });

        const recentJobs = await prisma.job.findMany({
            where: { postedAt: { gte: sevenDaysAgo } },
            select: { postedAt: true }
        });

        const dailyGrowth = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];

            return {
                date: dateString,
                users: recentUsers.filter(u => u.createdAt.toISOString().split('T')[0] === dateString).length,
                jobs: recentJobs.filter(j => j.postedAt.toISOString().split('T')[0] === dateString).length
            };
        }).reverse();

        // Revenue (Sum of successful transactions)
        const revenue = await prisma.transaction.aggregate({
            where: { status: 'success' },
            _sum: { amount: true }
        });

        res.json({
            users: { total: totalUsers, employers, jobSeekers },
            jobs: { total: totalJobs, active: activeJobs },
            revenue: revenue._sum.amount || 0,
            pendingVerifications,
            dailyGrowth
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                isVerified: true,
                createdAt: true,
                companyName: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const getPendingVerifications = async (req, res) => {
    try {
        const pending = await prisma.user.findMany({
            where: { role: 'EMPLOYER', isVerified: false },
            select: {
                id: true,
                name: true,
                email: true,
                companyName: true,
                location: true,
                createdAt: true,
                phone: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending verifications' });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isVerified } = req.body;

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { isVerified: isVerified !== undefined ? isVerified : true }
        });

        res.json({ message: 'Verification status updated', user: updated });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update verification status' });
    }
};

const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive }
        });

        res.json({ message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'}`, isActive: updatedUser.isActive });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getPendingVerifications,
    verifyUser,
    toggleUserStatus
};
