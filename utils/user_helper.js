const User = require('../models/user');
const _ = require('lodash');

/**
 * Fetches all users from the database and converts them to JSON format.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of user objects in JSON format.
 *                           Returns an empty array if an error occurs.
 */
const usersInDb = async () => {
  try {
    const users = await User.find({});
    return _.map(users, (user) => user.toJSON());
  } catch (error) {
    console.log('Error fetching users:', error.name);
    return [];
  }
};

/**
 * Creates a new user instance and returns its ID as a string.
 * This function is used to simulate a non-existing user ID for testing purposes.
 *
 * @returns {string} The ID of the newly created user as a string.
 */
const nonExistingId = () => {
  const user = new User({
    username: 'John123',
    name: 'John',
    passwordHash: 'abc123',
  });
  return user._id.toString();
};

module.exports = { usersInDb, nonExistingId };
