const Blog = require('../models/post');
const _ = require('lodash');
// const { blogs } = require('./data');

const dummy = (blogs) => {
  return 1;
};

// Check if an ID is non-existing
const nonExistingId = () => {
  const blog = new Blog({
    title: 'A Sample Blog Title',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 44,
  });
  return blog._id.toString();
};

const blogsInDb = async () => {
  try {
    const dbBlogs = await Blog.find({});
    return dbBlogs.map((blog) => blog.toJSON());
  } catch (error) {
    console.log('Error fetching blogs:', error);
    return [];
  }
};

const totalLikes = (listWithBlog) => {
  return listWithBlog.reduce((total, post) => total + (post.likes || 0), 0);
};

// Find out the favorite blog
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce(
    (max, post) => (post.likes > max.likes ? post : max),
    blogs[0]
  );
};

// Find the author who published the most blogs
const mostBlogs = (blogs) => {
  const groupByAuthor = _.groupBy(blogs, 'author');
  const postCount = _.map(groupByAuthor, (posts, author) => ({
    author: author,
    blogs: posts.length,
  }));
  return _.maxBy(postCount, 'blogs');
};

// Find the author with the most likes
const mostLikes = (blogs) => {
  const groupByAuthor = _.groupBy(blogs, 'author');
  const likesCount = _.map(groupByAuthor, (posts, author) => ({
    author: author,
    likes: _.sumBy(posts, 'likes'),
  }));
  return _.maxBy(likesCount, 'likes');
};

// blog is valid or not..
const isMissingOrEmpty = (value) => !value || value.trim() === '';

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  isMissingOrEmpty,
  nonExistingId,
  blogsInDb,
};
