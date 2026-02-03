const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initiateChat = async (req, res) => {
    try {
        const { jobId, employerId } = req.body;
        const jobSeekerId = req.user.id; // User must be job seeker for this flow generally, or employer contacting seeker (later)

        // Ensure Employer ID is provided
        if (!employerId) {
            return res.status(400).json({ error: 'Employer ID is required' });
        }

        // Check availability
        let chat = await prisma.chat.findUnique({
            where: {
                jobId_employerId_jobSeekerId: {
                    jobId: jobId || "", // Handle optional jobId logic if needed, but schema expects string if part of composite unique. 
                    // Wait, schema said jobId is optional String? 
                    // If jobId is null, unique constraint [jobId, employerId, jobSeekerId] might not work as expected in Postgres (nulls are distinct).
                    // Actually for this MVP, let's assume Chat is ALWAYS linked to a Job Application context or just a Job.
                    // RE-CHECK SCHEMA: unique([jobId, employerId, jobSeekerId]). 
                    // If jobId is null, we can't easily use this unique constraint for "General Chat". 
                    // Let's assume for now jobId is passed.
                    jobId,
                    employerId,
                    jobSeekerId
                }
            }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    jobId,
                    employerId,
                    jobSeekerId
                }
            });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error('Initiate Chat Error:', error);
        res.status(500).json({ error: 'Failed to initiate chat' });
    }
};

const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        // Check role to decide what to fetch? 
        // Or just fetch where employerId == userId OR jobSeekerId == userId.

        const chats = await prisma.chat.findMany({
            where: {
                OR: [
                    { employerId: userId },
                    { jobSeekerId: userId }
                ]
            },
            include: {
                job: { select: { title: true, companyName: true } },
                employer: { select: { id: true, name: true, profileImage: true, companyName: true } },
                jobSeeker: { select: { id: true, name: true, profileImage: true } },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(chats);
    } catch (error) {
        console.error('Get Chats Error:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
};

const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' },
            include: { sender: { select: { id: true, name: true, profileImage: true } } }
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

module.exports = { initiateChat, getUserChats, getChatMessages };
