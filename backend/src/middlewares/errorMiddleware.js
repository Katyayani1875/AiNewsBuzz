// src/middlewares/errorMiddleware.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  logger.error(err.stack);  // Log the full error stack
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Don't expose stack in production
  });
};

module.exports = { errorHandler };