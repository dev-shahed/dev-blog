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
const User = require("../models/user");
const userHelper = require("../utils/user_helper");
const jwtHelper = require("../utils/jwt_helper");
const bcrypt = require("bcrypt");
require("express-async-errors");

describe("Blog API tests", () => {
  let testUser;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("secret", 10);
    // Create a test user
    testUser = new User({
      username: "testuser",
      name: "Test User",
      passwordHash,
    });
    await testUser.save();

    // Insert initial blogs
    await Blog.insertMany(
      blogs.map((blog) => ({ ...blog, user: testUser._id }))
    );
  });

  describe("Retrieving blogs", () => {
    test("posts are returned as json", async () => {
      await api
        .get("/api/posts")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all posts are returned", async () => {
      const response = await api.get("/api/posts");
      const dbBlog = await listHelper.blogsInDb();
      assert.strictEqual(
        response.body.length,
        dbBlog.length,
        "Number of blogs returned does not match"
      );
    });

    test("a specific post is included in the returned posts", async () => {
      const response = await api.get("/api/posts");
      const titles = _.map(response.body, "title");
      assert(
        titles.includes("Type wars"),
        "Expected blog title not found in response"
      );
    });
  });

  describe("Viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const dbBlog = await listHelper.blogsInDb();
      const blogToView = dbBlog[0];
      const result = await api
        .get(`/api/posts/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
      const resultBlog = result.body;
      const expectedBlog = {
        id: blogToView.id,
        title: blogToView.title,
        author: blogToView.author,
        url: blogToView.url,
        likes: blogToView.likes,
        user: resultBlog.user,
      };
      assert.deepStrictEqual(
        resultBlog,
        expectedBlog,
        "Returned blog does not match the expected blog"
      );
    });

    test("fails with status code 404 if blog does not exist", async () => {
      const validNonexistingId = await listHelper.nonExistingId();
      await api.get(`/api/posts/${validNonexistingId}`).expect(404);
    });

    test("fails with status code 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445"; // Make sure this is an invalid format
      await api.get(`/api/posts/${invalidId}`).expect(400);
    });
  });

  describe("Adding a blog", () => {
    test("succeeds with valid data", async () => {
      const token = jwtHelper.signToken(testUser, process.env.JWT_SECRET);
      const newBlog = {
        title: "A New Blog Post Demo",
        author: "John Doe",
        url: "https://example.com",
        likes: 0,
        userId: testUser._id.toString(),
      };

      await api
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await listHelper.blogsInDb();
      assert.strictEqual(
        blogsAtEnd.length,
        blogs.length + 1,
        "Blog count did not increase"
      );
      const titles = _.map(blogsAtEnd, "title");
      assert(
        titles.includes("A New Blog Post Demo"),
        "New blog post not found in the list"
      );
    });

    test("fails with status code 400 if data is invalid", async () => {
      const token = jwtHelper.signToken(testUser, process.env.JWT_SECRET);
      const invalidBlog = {
        title: "",
        author: "John Doe",
        url: "https://example.com",
        likes: 0,
        userId: testUser._id.toString(),
      };

      await api
        .post("/api/posts")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidBlog)
        .expect(400);

      const blogsAtEnd = await listHelper.blogsInDb();
      assert.strictEqual(
        blogsAtEnd.length,
        blogs.length,
        "Blog count should not change for invalid data"
      );
    });
  });

  describe("Deleting a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const token = jwtHelper.signToken(testUser, process.env.JWT_SECRET);
      const blogAtStart = await listHelper.blogsInDb();
      const blogToDelete = blogAtStart[0];
      await api
        .delete(`/api/posts/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogAtEnd = await listHelper.blogsInDb();
      assert.strictEqual(
        blogAtEnd.length,
        blogAtStart.length - 1,
        "Blog count did not decrease"
      )
      const titles = _.map(blogAtEnd, "title");
      assert(
        !titles.includes(blogToDelete.title),
        "Deleted blog title still present"
      );
    });
  });

  describe("Utility functions", () => {
    test("dummy returns 1 for empty array", () => {
      const result = listHelper.dummy([]);
      assert.strictEqual(result, 1, "Dummy function did not return 1");
    });

    describe("Total likes", () => {
      test("returns the total likes of all blogs", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.totalLikes(dbBlog);
        assert.strictEqual(result, 36, "Total likes did not match");
      });
    });

    describe("Favorite blog", () => {
      test("returns the blog with the most likes", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.favoriteBlog(dbBlog);
        assert.deepStrictEqual(
          result,
          {
            id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            user: testUser._id,
          },
          "Favorite blog did not match"
        );
      });
    });

    describe("Most blogs", () => {
      test("returns the author with the most blogs", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.mostBlogs(dbBlog);
        assert.deepStrictEqual(
          result,
          {
            author: "Robert C. Martin",
            blogs: 3,
          },
          "Most blogs author did not match"
        );
      });
    });

    describe("Most likes", () => {
      test("returns the author with the most likes", async () => {
        const dbBlog = await listHelper.blogsInDb();
        const result = listHelper.mostLikes(dbBlog);
        assert.deepStrictEqual(
          result,
          {
            author: "Edsger W. Dijkstra",
            likes: 17,
          },
          "Most likes author did not match"
        );
      });
    });
  });

  /* =============================================================== */
  /// User testing..
  describe("when initially one user in db", () => {
    test("creation success with fresh username", async () => {
      const usersAtStart = await userHelper.usersInDb();
      const newUser = {
        username: "Heroalam",
        name: "Hero Alam",
        password: "Password123#",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await userHelper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const usernames = usersAtEnd.map((user) => user.username);
      assert(usernames.includes(newUser.username));
    });

    test("creation failed with proper status code and message if username already taken", async () => {
      const usersAtStart = await userHelper.usersInDb();
      const newUser = {
        username: "testuser",
        name: "Superuser",
        password: "suPer123#",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(409) // Expect Conflict status code
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await userHelper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
