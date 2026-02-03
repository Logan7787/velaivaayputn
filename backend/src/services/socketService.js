const socketIo = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let io;

const init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Allow connections from anywhere (App/Web)
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User Connected:', socket.id);

        /**
         * Join a specific Chat Room
         * Frontend emits: socket.emit('join_chat', 'chat_uuid')
         */
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
            console.log(`User joined Chat: ${chatId}`);
        });

        /**
         * Send a Message
         * Frontend emits: socket.emit('send_message', { chatId, senderId, content })
         */
        socket.on('send_message', async (data) => {
            const { chatId, senderId, content } = data;

            if (!chatId || !senderId || !content) return;

            try {
                // 1. Save Message to Database
                const newMessage = await prisma.message.create({
                    data: {
                        chatId,
                        senderId,
                        content,
                        isRead: false
                    },
                    include: {
                        sender: { select: { id: true, name: true, profileImage: true } }
                    }
                });

                // 2. Broadcast to everyone in the room (including sender)
                io.to(chatId).emit('receive_message', newMessage);

                // 3. Update Chat 'updatedAt' (to sort by recent)
                await prisma.chat.update({
                    where: { id: chatId },
                    data: { updatedAt: new Date() }
                });

            } catch (error) {
                console.error('Socket Message Error:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected', socket.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { init, getIo };
