// src/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ai_newsbuzz_dps", // A folder in Cloudinary to store profile pictures
    allowed_formats: ["jpeg", "png", "jpg"],
    // You can add transformations here, e.g., to ensure all DPs are square
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
    ],
  },
});

module.exports = { cloudinary, storage };