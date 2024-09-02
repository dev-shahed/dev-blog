const jwt = require('jsonwebtoken');

/**
 * Signs a JWT token for a given user.
 *
 * @param {Object} user - The user object containing at least an `id` and `username`.
 * @param {string} secret - The secret key used to sign the token.
 * @param {string} expiresIn - The duration the token should be valid for.
 * @returns {string} The signed JWT token.
 */
const signToken = (user, secret, expiresIn = '1h') => {
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  return jwt.sign(userForToken, secret, { expiresIn });
};

/**
 * Extracts the JWT token from the Authorization header.
 *
 * @param {Object} request - The HTTP request object.
 * @returns {string|null} The extracted token or null if not found.
 */
const getTokenForm = (request) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.replace('Bearer', '').trim();
  }
  return null;
};

/**
 * Verifies the provided JWT token using the given secret key.
 *
 * @param {string} token - The JWT token to be verified.
 * @returns {Object} The decoded token payload if verification is successful.
 * @throws {Object} Throws an error object with the error name if verification fails.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw { name: error.name };
  }
};

module.exports = { signToken, getTokenForm, verifyToken };
