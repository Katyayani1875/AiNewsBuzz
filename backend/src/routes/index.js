// src/routes/index.js
const express = require("express");
const newsRoutes = require("./newsRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const commentRoutes = require("./commentRoutes");
const notificationRoutes = require("./notificationRoutes"); 
const summaryRoutes = require("./summaryRoutes"); // Import summary routes
const router = express.Router();

router.use("/news", newsRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/comments", commentRoutes);
router.use("/summaries", summaryRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;