const logger = require('./logger');

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
    return res.status(409).send({ error: 'expected `username` to be unique' });
  } else if (error.name === 'UnauthorizedError') {
    return res.status(401).send({ error: 'unauthorized access' });
  } else if (error.name === 'ForbiddenError') {
    return res.status(403).send({ error: 'forbidden access' });
  } else if (error.status === 404) {
    return res.status(404).send({ error: 'resource not found' });
  } else {
    res.status(500).send({ error: 'internal server error' });
    next(error); // Call next only after the response
  }
};

// Exporting middlewares for use in other files
module.exports = {
  unknownEndpoint,
  errorHandler,
};
