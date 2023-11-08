const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const NewUser = require("../models/newUserSchema");

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      yearofadmission,
      yearofgrad,
      department,
      dateofbirth,
      employed,
      designation,
      companyname,
      companylocation,
      about,
      password,
      cpassword,
      linkedin,  // Add fields for social media links
      twitter,   // Add fields for social media links
      github,    // Add fields for social media links
    } = req.body;

    const userExists = await NewUser.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    if (password !== cpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newUser = new NewUser({
      firstname,
      lastname,
      email,
      phone,
      yearofadmission,
      yearofgrad,
      department,
      dateofbirth,
      employed,
      designation,
      companyname,
      companylocation,
      about,
      password,
      cpassword,
      linkedin,  // Store social media links
      twitter,   // Store social media links
      github,    // Store social media links
    });

    // Password hashing
    newUser.password = await bcrypt.hash(password, 12);
    newUser.cpassword = await bcrypt.hash(cpassword, 12);

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
