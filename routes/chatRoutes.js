const express = require('express');
const { getUsers, getMessages, sendMessage } = require('../controllers/chatController');
const { validateRequest } = require('../middleware/validateRequest');

const Router = express.Router();

Router.get('/users', validateRequest, getUsers);
Router.get('/messages/:userId', validateRequest, getMessages);
Router.post('/messages', validateRequest, sendMessage);

module.exports = Router;
