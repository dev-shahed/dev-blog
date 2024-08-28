const User = require('../models/user');
const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const userHelper = require('../utils/user_helper');
const app = require('../app');
const mongoose = require('mongoose');
const api = supertest(app);
const bcrypt = require('bcrypt');

describe('when initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });
  test('creation success with fresh username', async () => {
    const usersAtStart = await userHelper.usersInDb();
    const newUser = {
      username: 'heroalom',
      name: 'Hero Alam',
      password: 'password123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await userHelper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});
