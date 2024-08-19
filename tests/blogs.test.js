const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const listHelper = require('../utils/list_helper');
const { blogs } = require('../utils/data');
const Blog = require('../models/post');
const mongoose = require('mongoose');
const api = supertest(app);
require('express-async-errors');

describe('Test blog post', () => {
  describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
      await Blog.deleteMany({});
      await Blog.insertMany(blogs);
    });

    test('posts are returned as json', async () => {
      await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('dummy', () => {
    test('returns 1 when given an empty array', async () => {
      const result = await listHelper.dummy([]);
      assert.strictEqual(result, 1);
    });
  });

  describe('when there are blogs', () => {
    describe('totalLikes', () => {
      test('returns the total likes of all blogs', async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.totalLikes(dbBlog);
        assert.strictEqual(result, 36);
      });
    });

    describe('favoriteBlog', () => {
      test('returns the blog with the most likes', async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.favoriteBlog(dbBlog);
        assert.deepStrictEqual(result, {
          id: '5a422b3a1b54a676234d17f9',
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12,
        });
      });
    });

    describe('mostBlogs', () => {
      test('returns the author who has posted the most blogs', async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.mostBlogs(dbBlog);
        assert.deepStrictEqual(result, {
          author: 'Robert C. Martin',
          blogs: 3,
        });
      });
    });

    describe('mostLikes', () => {
      test('returns the author with the most likes', async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.mostLikes(dbBlog);
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
