const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./utils/db');
const middleware = require('./utils/middleware');
const postRouter = require('./controller/posts');
const { blogsInDb } = require('./utils/list_helper');

// Connect Database..
connectDB();

// Middleware setup..
app.use(express.json());
app.use(cors());

// Routes..
app.use('/api/posts', postRouter);

// Middleware..
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
