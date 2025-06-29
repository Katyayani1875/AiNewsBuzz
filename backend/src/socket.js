// let ioInstance = null;

// const setIoInstance = (io) => {
//   ioInstance = io;
// };

// const getIoInstance = () => {
//   if (!ioInstance) throw new Error("Socket.IO not initialized!");
//   return ioInstance;
// };

// module.exports = { setIoInstance, getIoInstance };
// backend/src/socket.js
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const logger = require("./utils/logger");

let ioInstance = null;

// This function now CREATES and configures the instance
const initializeSocket = (httpServer) => {
  // Define the whitelist of allowed origins
  const allowedOrigins = [
    'https://ai-news-buzz.vercel.app', // Vercel production URL
    'http://localhost:5173',          // local development URL (Vite)
    'http://localhost:3000',          // Another common local dev URL (CRA)
  ];

  ioInstance = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true, //essential for fixing the CORS error
    }
  });

  // Middleware to authenticate socket connections
  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return next();
            socket.user = decoded;
            next();
        });
    } else {
        next();
    }
  });

  // Main connection handler
  ioInstance.on("connection", (socket) => {
      logger.info(`A user connected: ${socket.id}`);

      if (socket.user) {
          socket.join(socket.user.id);
          logger.info(`User ${socket.user.id} joined their private room.`);
      }
      
      socket.on('join_article_room', (articleId) => {
          socket.join(articleId);
          logger.info(`Socket ${socket.id} joined article room: ${articleId}`);
      });

      socket.on('leave_article_room', (articleId) => {
          socket.leave(articleId);
          logger.info(`Socket ${socket.id} left article room: ${articleId}`);
      });

      socket.on("disconnect", () => {
          logger.info(`User disconnected: ${socket.id}`);
      });
  });

  logger.info("Socket.IO initialized successfully with CORS whitelist.");
  return ioInstance;
};

// allows other parts of app to get the initialized instance
const getIoInstance = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized! Must call initializeSocket first.");
  }
  return ioInstance;
};

module.exports = { initializeSocket, getIoInstance };