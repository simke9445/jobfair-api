const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const { emailValidator, phoneNumberValidator } = require('../utils/validators');

const AdminSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: phoneNumberValidator,
      msg: 'Wrong phone number format!',
    },
  },
  email: {
    type: String,
    validate: emailValidator,
    required: true,
  },
});

module.exports = User.discriminator('Admin', AdminSchema);
