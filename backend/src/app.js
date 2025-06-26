// backend/src/app.js (DEFINITIVE, SELF-CONTAINED, AND CORRECTED)

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken'); // You'll need this for authenticating sockets
const connectDB = require("./config/db");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");

const app = express();
const server = http.createServer(app);

// --- CORS CONFIGURATION ---
// This is the single source of truth for CORS settings for both Express and Socket.IO
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // This is essential for allowing cookies and auth headers
};

// --- MIDDLEWARE SETUP ---
app.use(cors(corsOptions));
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads

// --- DATABASE CONNECTION ---
connectDB();

// --- SOCKET.IO SETUP AND EVENT HANDLING ---
const io = new Server(server, {
  cors: corsOptions, // Reuse the same robust CORS options
});

// This makes the 'io' instance available to your controllers via req.app.get('io')
app.set("io", io);

// Middleware to authenticate socket connections
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // Don't reject the connection, just don't attach the user
                return next(); 
            }
            socket.user = decoded; // Attach user payload { id: '...' }
            next();
        });
    } else {
        next(); // Allow connection even without a token
    }
});

// Main connection handler
io.on("connection", (socket) => {
    logger.info(`A user connected: ${socket.id}`);

    // If the user is authenticated, have them join a private room
    if (socket.user) {
        socket.join(socket.user.id);
        logger.info(`User ${socket.user.id} joined their private room.`);
    }

    // Handler for joining article-specific rooms
    socket.on('join_article_room', (articleId) => {
        socket.join(articleId);
        logger.info(`Socket ${socket.id} joined article room: ${articleId}`);
    });

    // Handler for leaving article-specific rooms
    socket.on('leave_article_room', (articleId) => {
        socket.leave(articleId);
        logger.info(`Socket ${socket.id} left article room: ${articleId}`);
    });

    socket.on("disconnect", () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});


// --- API ROUTES ---
// This must come after the main middleware setup
app.use("/api", routes);

// --- ERROR HANDLING MIDDLEWARE ---
// This must come after the routes
app.use(errorHandler);

// --- EXPORT THE APP AND SERVER ---
module.exports = { app, server };   