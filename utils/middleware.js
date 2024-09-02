const logger = require('./logger');
const jwtHelper = require('./jwt_helper');



/**
 * Middleware to extract the JWT token from the Authorization header.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
const tokenExtractor = (req, res, next) => {
  const token = jwtHelper.getTokenForm(req);
  if (token) {
    req.token = token; // Attach the token to the request object
  }
  next(); // Continue to the next middleware or route handler
};

/**
 * Middleware for handling errors.
 *
 * @param {Object} error - The error object.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */



// Middleware for handling unknown endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// Middleware for handling errors
const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  } else if (
    error.code === 11000 &&
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    const field = error.message.match(/index: (.*?)_1/)[1];
    return res
      .status(409)
      .send({ error: `expected \`${field}\` to be unique` });
  } else if (error.name === 'UnauthorizedError') {
    return res.status(401).send({ error: 'unauthorized access' });
  } else if (error.name === 'ForbiddenError') {
    return res.status(403).send({ error: 'forbidden access' });
  } else if (error.status === 404) {
    return res.status(404).send({ error: 'resource not found' });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'token invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).send({
      error: 'token expired',
    });
  } else {
    res.status(500).send({ error: 'internal server error' });
    next(error); // Call next only after the response
  }
};

// Exporting middlewares for use in other files
module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};
