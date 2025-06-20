// src/app.js
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io"); // Import Server
const http = require("http"); // Import http
const connectDB = require("./config/db");
const routes = require("./routes"); // Import your routes index
const { errorHandler } = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");
const { setIoInstance } = require("./socket"); // Adjust path if needed

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  // Initialize Socket.IO with the server
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

setIoInstance(io); // Set the io instance after creating it

// Middleware
app.use(cors()); // Enable CORS for all origins (or configure for specific origins)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", routes); // Mount all routes under /api

// Error Handler (Must be after routes)
app.use(errorHandler);

// Socket.IO connection handling
io.on("connection", (socket) => {
  logger.info("a user connected");

  socket.on("disconnect", () => {
    logger.info("user disconnected");
  });

  // Example: Listen for a 'chat message' event and broadcast it
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // Broadcast to all connected clients
  });
});

// Add a function to export the instance
const getIoInstance = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized!");
  }
  return ioInstance;
};

module.exports = { app, server}; // Export the function
