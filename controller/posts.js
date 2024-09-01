const postRouter = require('express').Router();
const mongoose = require('mongoose');
const Blog = require('../models/post.js');
const jwtHelper = require('../utils/jwt_helper');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
require('express-async-errors');

// Route to handle the creation of a new blog post
// Validates input data, checks for duplicate titles, and saves the blog to the database
postRouter.post('', async (req, res, next) => {
  const { title, author, url, likes, userId } = req.body;
  //Extract and Verify token..
  const token = jwtHelper.getTokenForm(req);
  const decodeToken = jwtHelper.verifyToken(token, process.env.JWT_SECRET);

  if (!decodeToken || !decodeToken.id) {
    return res.status(401).end();
  }
  // Find the user by ID
  const user = await User.findById(decodeToken.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Create a new blog instance with the provided data
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user._id,
  });

  // Save the blog to the database and return the saved blog as a response
  const savedBlog = await blog.save();
  user.posts = user.posts.concat(savedBlog._id);
  await user.save();
  res.status(201).json(savedBlog);
});

/* =============================================================== */

// Route to handle fetching all blog posts from the database
// Returns a list of all blogs in the response
postRouter.get('', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.status(200).json(blogs);
});

/* =============================================================== */

// Route to handle fetching a single blog post by its ID
// If the blog is found, it is returned in the response; otherwise, a 404 error is returned
postRouter.get('/:id', async (req, res) => {
  const id = req.params.id;
  const theBlog = await Blog.findById(id);
  if (!theBlog) {
    return res.status(404).json({ message: `Blog with id ${id} not found!` });
  }
  res.status(200).json(theBlog);
});

/* =============================================================== */

//  Route to update a blog post by its ID
// It checks if the blog exists, and if it does, updates it with the provided data.
postRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const { title, author, url, likes } = req.body;
  const theBlog = await Blog.findById(id);
  if (!theBlog) {
    return res.status(404).json({ message: `Blog with id ${id} not found!` });
  }

  // Prepare the blog object with updated fields
  const blogUpdate = {
    title: title,
    author: author,
    url: url,
    likes: likes,
  };
  // The `new: true` option ensures the updated document is returned
  const updatedBlog = await Blog.findByIdAndUpdate(id, blogUpdate, {
    new: true,
  });
  res.status(200).json(updatedBlog);
});

/* =============================================================== */

// Route to delete a blog post by its ID
// If the blog is found, it is deleted from the database; otherwise, a 404 error is returned
postRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  const theBlog = await Blog.findByIdAndDelete(id);
  if (!theBlog) {
    return res.status(404).json({ message: `Blog with id ${id} not found!` });
  }

  res.status(204).end();
});

module.exports = postRouter;
