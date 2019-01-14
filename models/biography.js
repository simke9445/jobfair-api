const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { phoneNumberValidator, emailValidator } = require('../utils/validators');

const ExperienceSchema = new Schema({
  from: {
    type: Date,
    required: true,
  },
  to: Date,
  isOngoing: Boolean,
  position: {
    type: String,
    required: true,
  },
  organisationName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const BiographySchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  streetAddress: String,
  postalCode: String,
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    validate: phoneNumberValidator,
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  website: String,
  skypeName: String,
  workExperiences: [ExperienceSchema],
  educationExperiences: [ExperienceSchema],
  spokenLanguages: [String],
  skills: [String],
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
});

module.exports = mongoose.model('Biography', BiographySchema);
