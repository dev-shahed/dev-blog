const mongoose = require('mongoose');

userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
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
