var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var rateLimit = require('express-rate-limit');
var helmet = require('helmet');
require('dotenv').config();

var connectDB = require('./config/mongodb.config');
var applicationRouter = require('./routes/application.route');
var approverRouter = require('./routes/approver.route');

var app = express();

// Connect to MongoDB
connectDB();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    message: {
        success: false,
        message: 'Too many requests, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(helmet());
app.use(cors(["http://localhost:5173"]));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Apply rate limiting to all API routes
app.use('/api', limiter);

const prefix = '/api/v1';

// Apply rate limit for auth routes
app.use(`${prefix}/approver/login`, authLimiter);

app.use(`${prefix}`, applicationRouter);
app.use(`${prefix}/approver`, approverRouter);
app.use(`${prefix}/application`, applicationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
