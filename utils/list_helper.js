const _ = require('lodash');
const Blog = require('../models/post');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (listWithBlog) => {
  return listWithBlog.reduce((total, post) => total + (post.likes || 0), 0);
};

// find out favorite blog..
const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (max, post) => (post.likes > max.likes ? post : max),
    blogs[0]
  );
};

//find the author who published most blogs..
const mostBlogs = (blogs) => {
  //group the blog post by author..
  const groupByAuthor = _.groupBy(blogs, 'author');
  console.log(groupByAuthor);
  //count the number of blog post, posted by an author.
  const postCount = _.map(groupByAuthor, (posts, author) => {
    return { author: author, blogs: posts.length };
  });
  //find the author with the max number of blog post
  return _.maxBy(postCount, 'blogs');
};

//find the author with most likes
const mostLikes = (blogs) => {
  const groupByAuthor = _.groupBy(blogs, 'author');
  console.log(groupByAuthor);
  const likesCount = _.map(groupByAuthor, (posts, author) => {
    return {
      author: author,
      likes: _.sumBy(posts, 'likes'),
    };
  });
  return _.maxBy(likesCount, 'likes');
};

// blog is valid or not..
const isMissingOrEmpty = (value) => !value || value.trim() === '';

// check id is exist or not..
const nonExistingId = () => {
  const blog = new Blog({
    title: 'Test Title',
    author: 'Jhon Doe',
    url: 'https://example.com',
    likes: 44,
  });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  isMissingOrEmpty
};
