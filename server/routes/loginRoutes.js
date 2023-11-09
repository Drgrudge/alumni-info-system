//loginRoutes.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const NewUser = require("../models/newuserSchema");

// Login route
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Request Body:', req.body);

    const user = await NewUser.findOne({ email: email });

    if (!user) {
      console.log('User not found. Invalid credentials');
      return res.status(400).json({ message: "User not found. Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password,user.password)

    if (isPasswordValid) {
      console.log('Incorrect password. Invalid credentials');
      return res.status(400).json({ message: "Incorrect password. Invalid credentials" });
    }

    const token = await user.generateAuthToken();
    console.log('Generated Token:', token);
    return res.status(200).json({ token:token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
