const jwt = require('express-jwt');

const { Admin, Student, Company, User } = require('../models');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  
  return null;
};

const jwtMiddleware = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

const accessMiddleware = (...roles) => (req, res, next) => {
  const accessAllowed = roles.filter(role => role === req.payload.role).length > 0;

  if (!accessAllowed) {
    return next({
      message: 'Access prohibited.',
      status: 403,
    });
  }

  next();
}

const userModelMap = {
  'student': Student,
  'company': Company,
  'admin': Admin,
};

const getUserModel = type => {
  const model = Object.keys(userModelMap).find(x => type === x);
  
  if (!model) {
    throw {
      message: "User type doesn't exist.",
      status: 400,
    };
  }

  return userModelMap[model];
}

const authMiddleware = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user || user.password !== req.body.password) {
    return next({
      message: 'Invalid username or password.',
      status: 401,
    });
  }

  req.user = user;

  next();
}

module.exports = {
  jwtMiddleware,
  accessMiddleware,
  getUserModel,
  authMiddleware,
};