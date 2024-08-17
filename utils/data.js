const { faker } = require('@faker-js/faker');

const generateDummyBlog = (numOfBlogs) => {
  const DummyBlog = [];

  for (let i = 0; i < numOfBlogs; i++) {
    DummyBlog.push({
      title: faker.lorem.words(3),
      author: faker.person.fullName(),
      url: faker.internet.url(),
      likes: faker.number.int({ min: 0, max: 100 }),
    });
  }
  return DummyBlog;
};

module.exports = generateDummyBlog;
