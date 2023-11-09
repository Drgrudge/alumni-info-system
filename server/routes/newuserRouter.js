const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const multer = require("multer");
const NewUser = require("../models/newuserSchema");

// Set up storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await NewUser.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Profile picture upload route
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    const { userId } = req.body;

    const user = await NewUser.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture.data = req.file.buffer;
    user.profilePicture.contentType = req.file.mimetype;
    
    await user.save();

    res.status(200).json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
