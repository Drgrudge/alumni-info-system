const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const newUserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    // Make sure to handle non-editable logic in your application code, not here
  },
  lastname: {
    type: String,
    required: true,
    // Make sure to handle non-editable logic in your application code, not here
  },
  email: {
    type: String,
    required: true,
    // Make sure to handle non-editable logic in your application code, not here
  },
  phone: {
    type: Number,
    required: true,
    // Make sure to handle non-editable logic in your application code, not here
  },
  yearofadmission: {
    type: Number,
    required: true,
  },
  yearofgrad: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  dateofbirth: {
    type: String,
    // Make sure to handle non-editable logic in your application code, not here
  },
  employed: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    required: true,
  },
  companylocation: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String, // Add a field for LinkedIn profile link
  },
  twitter: {
    type: String, // Add a field for Twitter profile link
  },
  github: {
    type: String, // Add a field for GitHub profile link
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
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
      profilePicture: {
        data: Buffer,
        contentType: String,
        // Marked as editable, but handle editability logic in your application code
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Password hashing
newUserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// Generating token
newUserSchema.methods.generateAuthToken = async function () {
  try {
    let generatedToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: generatedToken });
    await this.save();
    return generatedToken;
  } catch (err) {
    console.log(err);
  }
};

// Storing messages
newUserSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
}

// Collection schema
const NewUser = mongoose.model('newuser', newUserSchema);

module.exports = NewUser;
