const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv');
const q = require('q');
const authService = require('../services/authService');
const User = require('../models/User');
dotenv.config();

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

function generateAccessToken(user) {
  const secretKey = process.env.PASSPORT_SECRET_KEY;
  const payload = {
    id: user._id,
    username: user.username,
  };

  const options = {
    expiresIn: '1h',
  };

  const accessToken = jwt.sign(payload, secretKey, options);

  return accessToken;
}

// Sign-up route
function signUp(req, res) {
  const deferred = q.defer();

  authService.signUp(req.body.username, req.body.password)
    .then(() => {
      res.status(201).json({ message: 'User created successfully' });
      deferred.resolve();
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: error.message || 'Bad Request' });
      deferred.reject(error);
    });

  return deferred.promise;
}

// Login route
function login(req, res, next) {
  const deferred = q.defer();

  passport.authenticate('local', { session: false }, async (err, user) => {
    try {
      if (err) {
        console.error(err);
        deferred.reject({ message: 'Internal Server Error' });
      } else if (!user) {
        deferred.reject({ message: 'Unauthorized' });
      } else {
        const token = generateAccessToken(user);
        res.json({ accessToken: token });
        deferred.resolve();
      }
    } catch (error) {
      deferred.reject(error);
    }
  })(req, res, next);

  return deferred.promise;
}

module.exports = { signUp, login, generateAccessToken };
