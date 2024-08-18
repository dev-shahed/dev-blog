const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const { blogs } = require('../utils/data');
const Blog = require('../models/post');
const { mongoose } = require('mongoose');

describe('Test blog post ', () => {
  describe('when there are initially some blog saved', () => {
    beforeEach(async () => {
      await Blog.deleteMany({});
      await Blog.insertMany(blogs);
    });
  });

  describe('dummy', () => {
    test('returns 1 when given an empty array', () => {
      const result = listHelper.dummy([]);
      assert.strictEqual(result, 1);
    });
  });

  describe('when there are blogs', () => {
    describe('totalLikes', () => {
      test('returns the total likes of all blogs', () => {
        const result = listHelper.totalLikes(blogs);
        assert.strictEqual(result, 36);
      });
    });

    describe('favoriteBlog', () => {
      test('returns the blog with the most likes', () => {
        const result = listHelper.favoriteBlog(blogs);
        assert.deepStrictEqual(result, {
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12,
        });
      });
    });

    describe('mostBlogs', () => {
      test('returns the author who has posted the most blogs', () => {
        const result = listHelper.mostBlogs(blogs);
        assert.deepStrictEqual(result, {
          author: 'Robert C. Martin',
          blogs: 3,
        });
      });
    });

    describe('mostLikes', () => {
      test('returns the author with the most likes', () => {
        const result = listHelper.mostLikes(blogs);
        assert.deepStrictEqual(result, {
          author: 'Edsger W. Dijkstra',
          likes: 17,
        });
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
