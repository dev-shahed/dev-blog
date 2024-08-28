const User = require('../models/user');
require('express-async-errors');
const bcrypt = require('bcrypt');

const userRouter = require('express').Router();

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

module.exports = userRouter;
