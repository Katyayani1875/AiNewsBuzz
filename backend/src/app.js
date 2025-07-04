// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const connectDB = require("./config/db");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");

// --- INITIAL APP AND SERVER SETUP ---
const app = express();
const server = http.createServer(app);

// --- CORS CONFIGURATION ---
// Define the list of allowed origins (front-end URLs)
const allowedOrigins = [
  'https://ai-news-buzz.vercel.app', // Your Vercel production URL
  'http://localhost:5173',          // Your local Vite/React development URL
  'http://localhost:3000',          // A common alternative for local dev
];

// Configure CORS options with a whitelist function
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like server-to-server, REST tools, or mobile apps)
    if (!origin) return callback(null, true);
    
    // Check if the incoming origin is in our whitelist
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      logger.warn(msg);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true, // Important for cookies, authorization headers, etc.
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));


// --- SECURITY HEADERS MIDDLEWARE (FIX FOR GOOGLE OAUTH) ---
// This middleware sets headers required for a secure cross-origin context,
// which is necessary for Google Sign-In's popup to communicate with your app.
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // The 'require-corp' policy is often used alongside COOP for a more secure context.
  // It ensures all subresources (like images, scripts) also opt-in to being loaded.
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); 
  next();
});


// --- STANDARD MIDDLEWARE ---
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies


// --- DATABASE CONNECTION ---
connectDB();


// --- SOCKET.IO SETUP ---
// The Socket.IO server MUST use the same CORS settings as the Express app.
const io = new Server(server, {
  cors: corsOptions,
});

// Make the 'io' instance available to all route handlers via the request object.
// This allows you to emit events from your controllers (e.g., after a new comment is posted).
app.set("io", io);

// Socket.IO authentication middleware. It runs for every new connection.
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // Token is invalid, but we still allow the connection without user data.
                logger.warn(`Socket Auth Failed: ${err.message}`);
                return next(); 
            }
            // Token is valid, attach user info to the socket object.
            socket.user = decoded;
            next();
        });
    } else {
        // No token provided, allow the connection as an anonymous user.
        next();
    }
});

// Main Socket.IO connection handler
io.on("connection", (socket) => {
    logger.info(`A user connected: ${socket.id}`);

    // If the user was authenticated via the middleware, join them to a private room.
    if (socket.user) {
        socket.join(socket.user.id);
        logger.info(`User ${socket.user.id} (Socket ID: ${socket.id}) joined their private room.`);
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

app.use("/api", routes);

app.use(errorHandler);

module.exports = { app, server };
// // backend/src/app.js
// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const connectDB = require("./config/db");
// const routes = require("./routes");
// const { errorHandler } = require("./middlewares/errorMiddleware");

// const app = express();
// const server = http.createServer(app); 

// // --- CORS CONFIGURATION FOR EXPRESS ROUTES ---
// const allowedOrigins = [
//   'https://ai-news-buzz.vercel.app',
//   'http://localhost:5173',
//   'http://localhost:3000',
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));

// // --- MIDDLEWARE SETUP ---
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // --- DATABASE CONNECTION ---
// connectDB();

// // --- API ROUTES ---
// app.use("/api", routes);

// app.use(errorHandler);

// module.exports = { server };

// // // backend/src/app.js (FINAL, BULLETPROOF VERSION)

// // const express = require("express");
// // const cors = require("cors");
// // const http = require("http");
// // const { Server } = require("socket.io");
// // const jwt = require('jsonwebtoken');
// // const connectDB = require("./config/db");
// // const routes = require("./routes");
// // const { errorHandler } = require("./middlewares/errorMiddleware");
// // const logger = require("./utils/logger");

// // const app = express();
// // const server = http.createServer(app);

// // // --- START OF FIX: CREATE AN EXPLICIT WHITELIST ---
// // // This list contains all the URLs that are allowed to make requests to your backend.
// // const allowedOrigins = [
// //   'https://ai-news-buzz.vercel.app', // Your Vercel production URL
// //   'http://localhost:5173',          // Your local development URL
// // ];
// // // --- END OF FIX ---


// // // --- CORS CONFIGURATION (UPDATED) ---
// // // We now use a function for the origin to check against our whitelist.
// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     // For requests with no origin (like mobile apps or curl requests)
// //     if (!origin) return callback(null, true);
    
// //     if (allowedOrigins.indexOf(origin) === -1) {
// //       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
// //       return callback(new Error(msg), false);
// //     }
// //     return callback(null, true);
// //   },
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   credentials: true, // This is essential
// // };

// // // --- MIDDLEWARE SETUP ---
// // app.use(cors(corsOptions));
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // --- DATABASE CONNECTION ---
// // connectDB();

// // // --- SOCKET.IO SETUP AND EVENT HANDLING (UPDATED) ---
// // // The Socket.IO server MUST use the same CORS settings.
// // const io = new Server(server, {
// //   cors: corsOptions, // Use the same updated corsOptions object
// // });

// // app.set("io", io);

// // // Middleware to authenticate socket connections
// // io.use((socket, next) => {
// //     const token = socket.handshake.auth.token;
// //     if (token) {
// //         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// //             if (err) {
// //                 return next(); 
// //             }
// //             socket.user = decoded;
// //             next();
// //         });
// //     } else {
// //         next();
// //     }
// // });

// // // Main connection handler
// // io.on("connection", (socket) => {
// //     logger.info(`A user connected: ${socket.id}`);

// //     if (socket.user) {
// //         socket.join(socket.user.id);
// //         logger.info(`User ${socket.user.id} joined their private room.`);
// //     }

// //     socket.on('join_article_room', (articleId) => {
// //         socket.join(articleId);
// //         logger.info(`Socket ${socket.id} joined article room: ${articleId}`);
// //     });

// //     socket.on('leave_article_room', (articleId) => {
// //         socket.leave(articleId);
// //         logger.info(`Socket ${socket.id} left article room: ${articleId}`);
// //     });

// //     socket.on("disconnect", () => {
// //         logger.info(`User disconnected: ${socket.id}`);
// //     });
// // });

// // // --- API ROUTES ---
// // app.use("/api", routes);

// // // --- ERROR HANDLING MIDDLEWARE ---
// // app.use(errorHandler);

// // // --- EXPORT THE APP AND SERVER ---
// // module.exports = { app, server };