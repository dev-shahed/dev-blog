const mongoose = require('mongoose');

// Define a custom validator for title
const validateTitle = (title) => {
  // Check if the title has at least 3 words
  return title.trim().split(/\s+/).length >= 2;
};

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    unique: true,
    validate: {
      validator: validateTitle,
      message: 'Title must be at least 2 words long'
    }
  },
  author: {
    type: String,
    required: [true, 'Author is required']
  },
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  likes: {
    type: Number,
    default: 0
  }
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
