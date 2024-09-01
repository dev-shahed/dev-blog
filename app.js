const express = require('express');
const app = express();
const connectDB = require('./utils/db');
const cors = require('cors');
const middleware = require('./utils/middleware');
const postRouter = require('./controller/posts');
const userRouter = require('./controller/users');
const loginRouter = require('./controller/login');

// Connect to the database
connectDB();

// Parse incoming JSON requests and Enable CORS
app.use(express.json());
app.use(cors());

// Define API routes
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

// Handle unknown endpoints
app.use(middleware.unknownEndpoint);

// Centralized error handling
app.use(middleware.errorHandler);

module.exports = app;
