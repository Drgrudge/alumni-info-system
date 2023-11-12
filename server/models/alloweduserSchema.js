const mongoose = require('mongoose');

const allowedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  date_of_birth: {
    type: String,
    required: true,
  },
}, {
  collection: 'allowed_users' // Specify the collection name here
});

const AllowedUsers = mongoose.model('AllowedUsers', allowedUserSchema);

module.exports = AllowedUsers;
