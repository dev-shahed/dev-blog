const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const listHelper = require("../utils/list_helper");
const { blogs } = require("../utils/data");
const Blog = require("../models/post");
const mongoose = require("mongoose");
const api = supertest(app);
const _ = require("lodash");
require("express-async-errors");

describe("Test blog post", () => {
  describe("when there are initially some blogs saved", () => {
    beforeEach(async () => {
      await Blog.deleteMany({});
      await Blog.insertMany(blogs);
    });

    test("posts are returned as json", async () => {
      await api
        .get("/api/posts")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all posts are returned", async () => {
      const response = await api.get("/api/posts");
      const dbBlog = await listHelper.blogsInDb();
      assert.strictEqual(response?.body?.length, dbBlog.length);
    });

    test("a specific post within the returned posts", async () => {
      const response = await api.get("/api/posts");
      const titles = _.map(response.body, "title");
      assert(titles.includes("Type wars"));
    });

    describe("viewing a specific post", () => {
      test("success with a valid id", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const blogToView = dbBlog[0];
        const result = await api
          .get(`/api/posts/${blogToView.id}`)
          .expect(200)
          .expect("Content-Type", /application\/json/);
        assert.deepStrictEqual(result.body, blogToView);
      });

      test("fails with statuscode 404 if blog does not exit", async () => {
        const validNonexistingId = await listHelper.nonExistingId();
        await api.get(`/api/posts/${validNonexistingId}`).expect(404);
      });

      test("fails with statuscode 400 if id is invalid", async () => {
        const invalidId = "5a3d5da59070081a82a3445";
        await api.get(`/api/posts/${invalidId}`).expect(400);
      });
    });

    describe("addition of a blog", () => {
      test("succed with valid data", async () => {
        const newBlog = {
          title: "Test Title",
          author: "John Doe",
          url: "https://example.com",
          likes: 0,
        };
        await api
          .post("/api/posts")
          .send(newBlog)
          .expect(201)
          .expect("Content-Type", /application\/json/);
        const blogsAtEnd = await listHelper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogs.length + 1);
        const titles = _.map(blogsAtEnd, "title");
        assert(titles.includes("Test Title"));
      });
    });
  });

  describe("dummy", () => {
    test("returns 1 when given an empty array", async () => {
      const result = await listHelper.dummy([]);
      assert.strictEqual(result, 1);
    });
  });

  describe("when there are blogs", () => {
    describe("totalLikes", () => {
      test("returns the total likes of all blogs", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.totalLikes(dbBlog);
        assert.strictEqual(result, 36);
      });
    });

    describe("favoriteBlog", () => {
      test("returns the blog with the most likes", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.favoriteBlog(dbBlog);
        assert.deepStrictEqual(result, {
          id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
        });
      });
    });

    describe("mostBlogs", () => {
      test("returns the author who has posted the most blogs", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.mostBlogs(dbBlog);
        assert.deepStrictEqual(result, {
          author: "Robert C. Martin",
          blogs: 3,
        });
      });
    });

    describe("mostLikes", () => {
      test("returns the author with the most likes", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.mostLikes(dbBlog);
        assert.deepStrictEqual(result, {
          author: "Edsger W. Dijkstra",
          likes: 17,
        });
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
