const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const allowedUsersModel = require('../models/alloweduserSchema');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/', upload.single('csvFile'), (req, res) => {
  console.log(req.file)
  const filePath = req.file.path;

  try {
    const stream = fs.createReadStream(filePath);

    stream
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const newUser = new allowedUsersModel({
            name: row.name,
            email: row.email,
            phone: row.phone,
            date_of_birth: row.date_of_birth,
            role: row.role === 'alumni' || row.role === 'admin' ? row.role : 'user',
          });
          await newUser.save();
        } catch (error) {
          console.error('Error saving user to MongoDB:', error);
        }
      })
      .on('end', () => {
        fs.unlinkSync(filePath); // Remove the uploaded CSV file
        res.send('Data uploaded to MongoDB');
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).send('Error processing CSV data');
  }
});

module.exports = router;
