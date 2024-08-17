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
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).send({ error: 'duplicate key error' });
  }
  if (error.name === 'UnauthorizedError') {
    return res.status(401).send({ error: 'unauthorized access' });
  }
  if (error.name === 'ForbiddenError') {
    return res.status(403).send({ error: 'forbidden access' });
  }
  if (error.status === 404) {
    return res.status(404).send({ error: 'resource not found' });
  }

  res.status(500).send({ error: 'internal server error' });

  next(error);
};

// Exporting middlewares for use in other files
module.exports = {
  unknownEndpoint,
  errorHandler,
};
