// ai-newsbuzz-backend/src/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");
const Comment = require('../models/Comment'); 
const { cloudinary } = require("../config/cloudinary");
const crypto = require('crypto');
const transporter = require('../config/mailer');

const { OAuth2Client } = require('google-auth-library'); 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID); 
// Generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
   console.log("--- Backend Controller: Received a request to /auth/register ---");
  console.log("Request Body:", req.body);
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      console.error("--- Backend Validation FAILED: One or more fields are missing ---");
      console.error("Received values:", { username, email, password });
      return res.status(400).json({ message: "Validation Failed: Please ensure all fields are provided." });
    }
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User with this email or username already exists." });
    }

    const user = await User.create({ username, email, password });

    if (user) {
      // Create a clean user object, including the default profile picture
      const userPayload = {
        _id: user._id,
        id: user._id, // Add 'id' for frontend convenience
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
      };
      
      // **Send the exact same response structure as loginUser**
      res.status(201).json({
        token: generateToken(user._id),
        user: userPayload,
      });
    } else {
      res.status(400).json({ message: "Invalid user data during creation." });
    }
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: "Server error during registration." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Create a clean user payload WITHOUT the password hash
      const userPayload = {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
      };
      
      res.json({
        token: generateToken(user._id),
        user: userPayload,
      });

    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server error during login." });
  }
};
// GET A USER'S PUBLIC PROFILE
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error(`Error getting public profile: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CURRENT USER'S PROFILE
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

// UPDATE USER PROFILE
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
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    logger.error(`Error updating profile: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserComments = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comments = await Comment.find({ user: user._id })
      .populate({
        path: 'news',
        select: 'title _id'
      })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(comments);
  } catch (error) {
    logger.error(`Error fetching user comments: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserLikedComments = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedComments = await Comment.find({ likes: user._id })
      .populate({
        path: 'news',
        select: 'title _id'
      })
      .populate({
        path: 'user',
        select: 'username profilePicture'
      })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(likedComments);
  } catch (error) {
    logger.error(`Error fetching user's liked comments: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// In backend/src/controllers/authController.js

// FORGOT PASSWORD: Generate token and send email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.info(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({ 
        message: 'If a user with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate plaintext token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token before saving to DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now
    
    // Clear any existing reset token first
    await user.save({ validateBeforeSave: false });

    // Create reset URL with plaintext token
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"AI NewsBuzz Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .button { 
                    display: inline-block; 
                    padding: 10px 20px; 
                    background-color: #4F46E5; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <p>You requested a password reset for your AI NewsBuzz account.</p>
            <p>Click the button below to reset your password (valid for 1 hour):</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>For security reasons, this link will expire in 1 hour.</p>
        </body>
        </html>`
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: 'Password reset link sent to email if account exists' 
    });

  } catch (error) {
    logger.error(`FORGOT_PASSWORD_ERROR: ${error.message}`);
    
    // Clear the reset token if email failed
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({ 
      message: 'Error sending email. Please try again later.' 
    });
  }
};

// VALIDATE RESET TOKEN: Check if the token is valid
const validateResetToken = async (req, res) => {
  try {
    const token = req.params.token;
    
    if (!token) {
      return res.status(400).json({ 
        message: 'Token is required' 
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Token is invalid or has expired',
        valid: false
      });
    }

    res.status(200).json({ 
      message: 'Token is valid',
      valid: true,
      email: user.email 
    });

  } catch (error) {
    logger.error(`TOKEN_VALIDATION_ERROR: ${error.message}`);
    res.status(500).json({ 
      message: 'Error validating token' 
    });
  }
};
// RESET PASSWORD: Update the user's password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: 'Token is required' 
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters' 
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Token is invalid or has expired' 
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: `"AI NewsBuzz Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Changed Successfully',
      html: `<!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
            </style>
        </head>
        <body>
            <p>Your AI NewsBuzz password has been successfully changed.</p>
            <p>If you didn't make this change, please contact support immediately.</p>
        </body>
        </html>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Password updated successfully' 
    });

  } catch (error) {
    logger.error(`PASSWORD_RESET_ERROR: ${error.message}`);
    res.status(500).json({ 
      message: 'Error resetting password' 
    });
  }
};
const googleAuth = async (req, res) => {
    const { token } = req.body; // The ID token sent from the frontend

    if (!token) {
        logger.warn('Google Auth: ID token is missing from request body.');
        return res.status(400).json({ message: 'Google ID token is missing.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID, // This ensures the token was issued for YOUR app
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub']; // Google's unique user ID
        const email = payload['email'];
        const name = payload['name'];
        const picture = payload['picture'];

        if (!email) {
            logger.error(`Google Auth: No email in payload for googleId ${googleId}.`);
            return res.status(400).json({ message: 'Google account missing email address.' });
        }

        let user = await User.findOne({ $or: [{ googleId: googleId }, { email: email }] });

        if (!user) {
            // User does not exist, create a new one.
            const randomPassword = crypto.randomBytes(16).toString('hex'); // Generate dummy password
            
            user = new User({
                username: name || email.split('@')[0], // Use Google name, or part of email as username
                email: email,
                password: randomPassword, // This will be hashed by the pre-save hook
                profilePicture: { url: picture }, // Use Google profile picture
                googleId: googleId,
            });
            await user.save();
            logger.info(`Google Auth: New user registered - ${email}`);
        } else {
            // User exists, update or link Google ID if necessary
            if (!user.googleId) {
                user.googleId = googleId;
                logger.info(`Google Auth: Existing user ${email} linked with Google ID.`);
            }
            // Always update profile picture from Google (can be useful if user changes it)
            if (user.profilePicture) {
                user.profilePicture.url = picture; 
            } else {
                user.profilePicture = { url: picture };
            }
            await user.save();
            logger.info(`Google Auth: User ${email} logged in.`);
        }

        // Generate your application's JWT for the logged-in/registered user
        const appToken = generateToken(user._id);

        // Send back your app's token and a clean user object
        res.status(200).json({
            token: appToken,
            user: {
                _id: user._id,
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePicture: user.profilePicture,
            },
        });

    } catch (error) {
        logger.error(`Google Auth Verification Error: ${error.message}`);
        res.status(401).json({ message: 'Google authentication failed. Invalid token or server error.' });
    }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateUserProfile,
  getPublicProfile,
  getUserComments,
  getUserLikedComments,
  forgotPassword,
  validateResetToken,
  resetPassword, googleAuth,
};