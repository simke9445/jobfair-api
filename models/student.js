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
    },
  },
  email: {
    type: String,
    validate: emailValidator,
    required: true,
  },
  yearOfStudy: Number,
  hasGraduated: Boolean,
  profileImage: {
    type: String,
    data: Buffer
  }, // work with images later
  biography: {
    type: Schema.Types.ObjectId,
    ref: 'Biography',
  },
});

module.exports = User.discriminator('Student', StudentSchema);
