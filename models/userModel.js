const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.json');

// Load users from file
const loadUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
};

// Save users to file
const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 4), 'utf-8');
};

// Find user by username
const findUserByUsername = (username) => {
    const users = loadUsers();
    return users.find(user => user.username === username);
};

// Add new user
const addUser = (user) => {
    const users = loadUsers();
    users.push(user);
    saveUsers(users);
};

module.exports = { findUserByUsername, addUser, loadUsers };
