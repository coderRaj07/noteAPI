// src/services/authService.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function signUp(username, password) {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
  } catch (error) {
    throw error;
  }
}

async function login(username, password) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = { signUp, login };
