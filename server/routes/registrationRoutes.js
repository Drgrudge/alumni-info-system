// registrationRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const AllowedUsers = require('../models/alloweduserSchema');
const NewUser = require('../models/newuserSchema');

router.post('/', async (req, res) => {
  const { name, email, phone, dateOfBirth, password, role } = req.body;
  console.log(req.body)
  try {
    console.log('Received request with data:', req.body);

    // Basic validation (you can add more validation as needed)
    if (!name || !email || !phone || !dateOfBirth || !password || !role) {
      console.log('Validation failed. All fields are required.');
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the user is allowed (exists in the allowed_users collection)
    const allowedUser = await AllowedUsers.findOne({ name, email, phone });

    if (allowedUser) {
      // Validate the role to be either "admin" or "alumni"
      if (role !== 'admin' && role !== 'alumni') {
        console.log('Validation failed. Invalid role.');
        return res.status(400).json({ success: false, message: 'Invalid role. Allowed roles are "admin" or "alumni".' });
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed

      // Create a new user in the NewUser collection
      const newUser = new NewUser({
        name,
        email,
        phone,
        role,
        date_of_birth: dateOfBirth,
        password: hashedPassword,
      });

      await newUser.save();

      console.log('Registration successful.');
      // Return success status
      return res.status(200).json({ success: true, message: 'Registration successful' });
    } else {
      // User not allowed, return an error
      console.log('User not allowed to register.');
      return res.status(403).json({ success: false, message: 'User not allowed to register.' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
