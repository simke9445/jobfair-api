const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const { emailValidator, phoneNumberValidator } = require('../utils/validators');

const StudentSchema = new Schema({
  firstName: String,
  lastName: String,
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
  yearOfStudy: Number,
  hasGraduated: Boolean,
  image: String,
  biography: {
    type: Schema.Types.ObjectId,
    ref: 'Biography',
  },
});

module.exports = User.discriminator('Student', StudentSchema);
