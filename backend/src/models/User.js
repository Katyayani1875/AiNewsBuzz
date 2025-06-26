// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    // --- NEW PROFILE FIELDS ---
    profilePicture: {
      public_id: String, // The ID from Cloudinary
      url: { type: String, default: "https://i.imgur.com/V4Rcl9I.png" }, // Default placeholder DP
    },
    bio: { type: String, maxlength: 160, default: "" },
    location: { type: String, maxlength: 50, default: "" },
    website: { type: String, maxlength: 100, default: "" },
    passwordResetToken: String,
    passwordResetExpires: Date,
    // Existing fields
    followedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }], // Reference to Channel model
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
