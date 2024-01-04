// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dotenv = require('dotenv');
const authService = require('../services/authService');
const User = require('../models/User');
dotenv.config()

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
async function signUp(req, res) {
  try {
    const { username, password } = req.body;
    await authService.signUp(username, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Bad Request' });
  }
}

// Login route
function login(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = generateAccessToken(user);
    res.json({ accessToken: token });
  })(req, res, next);
}

module.exports = { signUp, login, generateAccessToken };
