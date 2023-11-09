//app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const registrationRoutes = require('./routes/registrationRoutes');
const loginRoutes = require('./routes/loginRoutes');
const profilePictureRoutes = require('./routes/profilePictureRoutes');
const db = require('./db/db'); // Import your database connection module
const uploadRoutes = require('./routes/uploadRoutes'); // Import your file upload route module

const app = express();
const port = process.env.PORT ||5000;

app.use(cors());
require('dotenv').config({ path: './config.env' });

db.connect()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware
app.use(bodyParser.json());

// Register routes
app.use('/register', registrationRoutes);
app.use('/login', loginRoutes);
app.use('/profile-picture', profilePictureRoutes);
app.use('/upload', uploadRoutes); // Use the file upload route here

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
