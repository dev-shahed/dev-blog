const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
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
