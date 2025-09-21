const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { findUserByUsername, addUser, loadUsers } = require('../models/userModel.js');
const { hashPassword, comparePassword } = require('../utils/hash.js');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Register controller
const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (findUserByUsername(username)) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const users = loadUsers();
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword,
        };

        addUser(newUser);

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

// Login controller
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const payload = { user: { id: user.id, username: user.username } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return res.json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
};


const profileData = (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
        id: user.id,
        username: user.username,
        message: `Welcome to your protected profile, ${user.username}!`
    });
};

module.exports = { register, login, profileData };
