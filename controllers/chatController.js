const { loadUsers } = require('../models/userModel');
const { loadMessages, addMessage } = require('../models/messageModel');


const getUsers = (req, res) => {
  const users = loadUsers().map(u => ({ id: u.id, phone: u.phone }));
  console.log(users, "user===>")
  const filtered = users.filter(u => u.id !== req.user.id);
  res.json(filtered);
};

// Get chat history between two users
const getMessages = (req, res) => {
  const { userId } = req.params;
  const myId = req.user.id;

  const messages = loadMessages().filter(
    (msg) =>
      (msg.senderId === myId && msg.receiverId == userId) ||
      (msg.senderId == userId && msg.receiverId === myId)
  );

  res.json(messages);
};

// Save new message
const sendMessage = (req, res) => {
  const { receiverId, text } = req.body;
  if (!receiverId || !text) {
    return res.status(400).json({ message: 'receiverId and text are required' });
  }

  const newMessage = {
    id: Date.now(),
    senderId: req.user.id,
    receiverId,
    text,
    timestamp: new Date().toISOString(),
  };

  addMessage(newMessage);
  res.status(201).json(newMessage);
};

module.exports = { getUsers, getMessages, sendMessage };
