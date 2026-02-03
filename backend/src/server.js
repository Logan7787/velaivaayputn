const app = require('./app');
const http = require('http');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const { init: initSocket } = require('./services/socketService');

dotenv.config();

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
