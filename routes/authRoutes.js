// const express = require('express')
// const Router = express.Router();
// const {register, login, profileData} = require('../controllers/authController.js')
// const {validateRequest} = require('../middleware/validateRequest.js');

// Router.post('/register', register)
// Router.post('/login', login);
// Router.get('/profile', validateRequest, profileData);

// module.exports = Router



const express = require('express');
const Router = express.Router();
const {
  requestOtp,
  verifyOtp,
  setPassword,
  login,
  profileData,
} = require('../controllers/authController.js');
const { validateRequest } = require('../middleware/validateRequest.js');

// OTP-based registration flow
Router.post('/register/request-otp', requestOtp);
Router.post('/register/verify-otp', verifyOtp);
Router.post('/register/set-password', setPassword);

// Login + Profile
Router.post('/login', login);
Router.get('/profile', validateRequest, profileData);

module.exports = Router;
