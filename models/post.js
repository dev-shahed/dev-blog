const mongoose = require('mongoose');
const validator = require('validator');

// Define a custom validator for title
const validateTitle = (title) => {
  // Check if the title has at least 2 words
  return title.trim().split(/\s+/).length >= 2;
};

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    unique: true,
    validate: {
      validator: validateTitle,
      message: 'Title must be at least 2 words long',
    },
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    validate: {
      validator: (author) =>
      validator.isAlpha(author.replace(/\./g, ''), 'en-US', { ignore: ' ' }),
      message: 'Author name must contain only letters, periods, and spaces',
    },
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: validator.isURL,
      message: 'Invalid URL format',
    },
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

//modify the json output _id change to id and delete __v
blogSchema.set('toJSON', {
  transform: (doc, objReturn) => {
    delete objReturn._id;
    delete objReturn.__v;
    return {
      id: doc._id.toString(),
      ...objReturn,
    };
  },
});

module.exports = mongoose.model('Blog', blogSchema);
