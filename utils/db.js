const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

const dbUrl = config.MONGODB_URI;
if (!dbUrl) {
  logger.error('MONGODB_URL environment variable is missing');
  process.exit(1);
}

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    logger.info('connected to MongoDB');
  } catch (error) {
    logger.error('error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
