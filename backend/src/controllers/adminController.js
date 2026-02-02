const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const employers = await prisma.user.count({ where: { role: 'EMPLOYER' } });
        const jobSeekers = await prisma.user.count({ where: { role: 'JOBSEEKER' } });
        const totalJobs = await prisma.job.count();
        const activeJobs = await prisma.job.count({ where: { status: 'ACTIVE' } });

        // Revenue (Sum of successful transactions)
        const revenue = await prisma.transaction.aggregate({
            where: { status: 'success' },
            _sum: { amount: true }
        });

        res.json({
            users: { total: totalUsers, employers, jobSeekers },
            jobs: { total: totalJobs, active: activeJobs },
            revenue: revenue._sum.amount || 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
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
    toggleUserStatus
};
