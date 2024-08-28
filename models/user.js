const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (username) =>
        validator.isLength(username, { min: 3 }) &&
        /^[a-zA-Z0-9_]+$/.test(username),
      message:
        'Username must be at least 3 characters long and can only contain letters, numbers, and underscores.',
    },
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
    validate: {
      validator: (password) =>
        validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }),
      message:
        'Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (doc, objReturn) => {
    delete objReturn._id;
    delete objReturn.__v;
    delete objReturn.passwordHash;
    return {
      id: doc._id.toString(),
      ...objReturn,
    };
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
