const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt_helper');
const loginRouter = require('express').Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    // Check if the user exists and the password is correct
    const passwordCorrect =
      user && (await bcrypt.compare(password, user.passwordHash));
    if (!(user && passwordCorrect)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Sign the token with the secret key
    const token = signToken(user, process.env.JWT_SECRET);
    res.status(200).json({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error while login' });
  }
});

module.exports = loginRouter;
