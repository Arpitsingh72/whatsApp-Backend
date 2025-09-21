const express = require('express')
const Router = express.Router();
const {register, login, profileData} = require('../controllers/authController.js')
const {validateRequest} = require('../middleware/validateRequest.js');

Router.post('/register', register)
Router.post('/login', login);
Router.get('/profile', validateRequest, profileData);

module.exports = Router