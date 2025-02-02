const joi = require('joi');

const { getUserModel } = require('../utils/auth');
const { validate } = require('../utils/request');
const User = require('../models/user');

class AuthController {
  /**
   * POST: /auth/login
   * @param {Request} req 
   * @param {Response} res 
   */
  static async login(req, res) {
    try {
      const user = req.user;

      res.statusCode = 200;
      res.json(user.toAuthJSON());
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * POST: /auth/register
   * @param {Request} req 
   * @param {Response} res 
   */
  static async register(req, res) {
    try {
      const UserModel = getUserModel(req.body.type);

      const user = new UserModel(req.body);
      user.image = req.file.path;

      await user.save();

      res.statusCode = 200;
      res.json(user.toAuthJSON());
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }

  /**
   * POST: /auth/changePassword
   * @param {Request} req 
   * @param {Response} res 
   */
  static async changePassword(req, res) {
    try {
      const { username } = req.body;
      const { password, confirmPassword, oldPassword } = validate(req.body, requestValidators.changePassword);

      const user = await User.findOne({ username });

      if (user.password !== oldPassword || password !== confirmPassword) {
        throw {
          message: 'Password mismatched',
          status: 400,
        };
      }

      user.password = password;

      await user.save();

      res.statusCode = 200;
      res.json(user.toAuthJSON());
    } catch (err) {
      res.statusCode = 400;
      res.json(err);
    }
  }
}

const requestValidators = {
  changePassword: {
    username: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
    oldPassword: joi.string().required(),
  },
}

module.exports = AuthController;
