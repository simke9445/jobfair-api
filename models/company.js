const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const { emailValidator, bussinessAreaValidator } = require('../utils/validators');

const CompanyScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  director: String,
  pib: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  website: String,
  bussinessArea: {
    type: String,
    required: true,
    validate: bussinessAreaValidator,
  },
  specialization: String,
  image: String,
});

module.exports = User.discriminator('Company', CompanyScheme);
