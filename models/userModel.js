

const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

// Load users
const loadUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Save users
const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4), 'utf-8');
};

// Find user by phone
const findUserByPhone = (phone) => {
  const users = loadUsers();
  return users.find((user) => user.phone === phone);
};

// Add new user
const addUser = (user) => {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
};

// Update user password
const updateUserPassword = (phone, hashedPassword) => {
  const users = loadUsers();
  const index = users.findIndex((u) => u.phone === phone);
  if (index !== -1) {
    users[index].password = hashedPassword;
    saveUsers(users);
  }
};

module.exports = { findUserByPhone, addUser, loadUsers, updateUserPassword };
