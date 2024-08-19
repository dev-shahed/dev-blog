const connectDB = require('./utils/db');
const express = require('express');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const postRouter = require('./controller/posts');

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
