const env = require('../config/env');

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack })
  });
};

module.exports = { errorMiddleware };
