var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var errorhandler = require('errorhandler');
var cors = require('cors');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();

  app.use(errorhandler());
}

// setup mongoose
var dbUrl = `mongodb://127.0.0.1/${process.env.DB_NAME}`;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var routes = require('./routes');

app.use(routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    message: err.message,
  });
});

module.exports = app;
