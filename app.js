const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const flash = require('connect-flash');
const FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;

dotenv.load();

const routes = require('./routes/index');
const unparameterized_user = require('./routes/unparameterized-user');

// This will configure Passport to use Fitbit
const fitbitStrategy = new FitbitStrategy({
  clientID:     process.env.FITBIT_CLIENT_ID,
  clientSecret: process.env.FITBIT_CLIENT_SECRET,
  callbackURL:  process.env.FITBIT_CALLBACK_URL,
  scope: ['activity','heartrate','location','profile','sleep']
}, function(accessToken, refreshToken, profile, done) {
  // TODO: save accessToken here for later use
  console.log(accessToken);

  done(null, {
    accessToken: accessToken,
    refreshToken: refreshToken,
    profile: profile
  });

});

passport.use(fitbitStrategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'shhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// Handle auth failure error messages
app.use(function(req, res, next) {
 if (req && req.query && req.query.error) {
   req.flash("error", req.query.error);
 }
 if (req && req.query && req.query.error_description) {
   req.flash("error_description", req.query.error_description);
 }
 next();
});

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});

app.use('/', routes);
app.use('/supply', unparameterized_user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
