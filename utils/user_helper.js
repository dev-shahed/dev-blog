const User = require('../models/user');
const _ = require('lodash');

const usersInDb = async () => {
  try {
    const users = await User.find({});
    return _.map(users, (user) => user.toJSON());
  } catch (error) {
    console.log('error fetching users..', error);
    return [];
  }
};

// Check if an User id is non-existing
const nonExistingId = () => {
  const user = new User({
    username: 'John123',
    name: 'John',
    passwordHash: 'abc123',
  });
  return user._id.toString();
};

module.exports = { usersInDb, nonExistingId };
