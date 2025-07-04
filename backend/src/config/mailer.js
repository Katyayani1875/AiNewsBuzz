const nodemailer = require('nodemailer');
const logger = require('../utils/logger'); 

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your app password from .env
    },
    tls: {
        rejectUnauthorized: false // Necessary for some providers, including localhost
    }
});

// Verify connection configuration when the server starts
transporter.verify((error, success) => {
    if (error) {
        logger.error(`Nodemailer configuration error: ${error.message}`);
    } else {
        logger.info('Nodemailer is configured and ready to send emails.');
    }
});

module.exports = transporter;