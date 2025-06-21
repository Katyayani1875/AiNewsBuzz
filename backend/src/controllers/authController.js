// ai-newsbuzz-backend/src/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const { cloudinary } = require("../config/cloudinary"); // Import Cloudinary

// Generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Adjust as needed
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// GET A USER'S PUBLIC PROFILE (NEW)
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -email"
    ); // Exclude private info

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // You might also want to send back the user's recent comments or liked articles
    res.json(user);
  } catch (error) {
    logger.error(`Error getting public profile: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CURRENT USER'S PROFILE (MODIFIED FOR CLARITY)
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error(`Profile retrieval error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER PROFILE (NEW)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update text fields
      user.bio = req.body.bio || user.bio;
      user.location = req.body.location || user.location;
      user.website = req.body.website || user.website;

      // Handle profile picture upload
      if (req.file) {
        // If there's an old picture, delete it from Cloudinary
        if (user.profilePicture && user.profilePicture.public_id) {
          await cloudinary.uploader.destroy(user.profilePicture.public_id);
        }
        user.profilePicture = {
          public_id: req.file.filename,
          url: req.file.path,
        };
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        bio: updatedUser.bio,
        // ... send back other updated info as needed
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    logger.error(`Error updating profile: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// EXPORT all functions
module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateUserProfile,
  getPublicProfile,
};