const express = require("express");
const router = express.Router();
const multer = require("multer");
const NewUser = require("../models/newuserSchema");

// Set up storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
