// db.js

const mongoose = require('mongoose');

module.exports = {
  connect: async () => {
    try {
      const mongoDBURI = process.env.MONGODB_URI; // Retrieve MongoDB URI from environment variable

      // Connect to MongoDB without deprecated options
      await mongoose.connect(mongoDBURI);

      console.log('Connected to the MongoDB database');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  },
};
