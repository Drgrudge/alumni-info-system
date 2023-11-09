//newuserSchema

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const newUserSchema = new mongoose.Schema({
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
  yearofadmission: {
    type: Number,
  },
  yearofgrad: {
    type: Number,
  },
  department: {
    type: String,
  },
  date_of_birth: {
    type: String,
    required: true,
  },
  employed: {
    type: String,
  },
  designation: {
    type: String,
  },
  companyname: {
    type: String,
  },
  companylocation: {
    type: String,
  },
  about: {
    type: String,
    required: false,
  },
  linkedin: {
    type: String,
  },
  twitter: {
    type: String,
  },
  github: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  // Remove the extra curly brace here
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
      },
      message: {
        type: String,
        required: false,
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
    // Remove the line below, as cpassword is not defined in your schema
    // this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// Generating token
newUserSchema.methods.generateAuthToken = async function () {
  try {
    if (!process.env.SECRET_KEY) {
      throw new Error('Secret key not defined');
    }

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
const NewUser = mongoose.model('NewUser', newUserSchema);

module.exports = NewUser;
