const fs = require('fs');
const path = require('path');

const messagesFilePath = path.join(__dirname, 'messages.json');

// Load messages
const loadMessages = () => {
  try {
    const data = fs.readFileSync(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Save messages
const saveMessages = (messages) => {
  fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 4), 'utf-8');
};

// Add a new message
const addMessage = (message) => {
  const messages = loadMessages();
  messages.push(message);
  saveMessages(messages);
};

module.exports = { loadMessages, addMessage };
