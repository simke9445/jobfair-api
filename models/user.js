const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const { passwordValidator } = require('../utils/validators');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 12,
    validate: passwordValidator,
  },
}, { discriminatorKey: 'kind' });

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    username: this.username,
    id: this._id,
    role: this.kind.toLowerCase(),
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UserSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    username: this.username,
    role: this.kind.toLowerCase(),
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', UserSchema);
