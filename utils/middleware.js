const logger = require('./logger');
const jwtHelper = require('./jwt_helper');
const User = require('../models/user');

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
  next();
};

/**
 * Middleware to extract the JWT token from the Authorization header,
 * verify it, and attach the authenticated user to the request object.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
const userExtractor = async (req, res, next) => {
  const token = jwtHelper.getTokenForm(req);
  if (!token) return next();

  try {
    // Verify the extracted token and decode its payload
    const decodedToken = jwtHelper.verifyToken(token);
    if (!decodedToken?.id) throw new Error('JsonWebTokenError');

    // Find the user in the database by the ID from the token, excluding the password hash
    const user = await User.findById(decodedToken.id).select('-passwordHash');
    if (!user) throw new Error('UnauthorizedError');
    // Attach the authenticated user to the request object for use in subsequent middleware
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
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

  const errorResponse = {
    CastError: () => res.status(400).send({ error: 'malformed id' }),
    ValidationError: () => res.status(400).send({ error: error.message }),
    MongoServerError: () => {
      if (
        error.code === 11000 &&
        error.message.includes('E11000 duplicate key error')
      ) {
        const field = error.message.match(/index: (.*?)_1/)[1];
        return res
          .status(409)
          .send({ error: `expected \`${field}\` to be unique` });
      }
    },
    UnauthorizedError: () =>
      res.status(401).send({ error: 'unauthorized access' }),
    ForbiddenError: () => res.status(403).send({ error: 'forbidden access' }),
    JsonWebTokenError: () => res.status(401).send({ error: 'token invalid' }),
    TokenExpiredError: () => res.status(401).send({ error: 'token expired' }),
  };

  if (errorResponse[error.name]) {
    return errorResponse[error.name]();
  }

  if (error.status === 404) {
    return res.status(404).send({ error: error.message });
  }

  res.status(500).send({ error: 'internal server error' });
  next(error); // Call next only after the response
};

// Exporting middlewares for use in other files
module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
