const express = require('express');
const app = express();
const connectDB = require('./utils/db');
const cors = require('cors');
const middleware = require('./utils/middleware');
const postRouter = require('./controller/posts');
const userRouter = require('./controller/users');

// Connect Database..
connectDB();

// Middleware setup..
app.use(express.json());
app.use(cors());

// Routes..
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

// Middleware..
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
