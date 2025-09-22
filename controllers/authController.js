// const dotenv = require('dotenv');
// const jwt = require('jsonwebtoken');
// const { findUserByUsername, addUser, loadUsers } = require('../models/userModel.js');
// const { hashPassword, comparePassword } = require('../utils/hash.js');

// dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET;

// // Register controller
// const register = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ message: 'Username and password are required' });
//         }

//         if (findUserByUsername(username)) {
//             return res.status(409).json({ message: 'Username already exists' });
//         }

//         const hashedPassword = await hashPassword(password);

//         const users = loadUsers();
//         const newUser = {
//             id: users.length + 1,
//             username,
//             password: hashedPassword,
//         };

//         addUser(newUser);

//         return res.status(201).json({ message: 'User registered successfully!' });
//     } catch (error) {
//         console.error('Registration error:', error);
//         return res.status(500).json({ message: 'Server error during registration' });
//     }
// };

// // Login controller
// const login = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ message: 'Username and password are required' });
//         }

//         const user = findUserByUsername(username);
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         const isMatch = await comparePassword(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid username or password' });
//         }

//         const payload = { user: { id: user.id, username: user.username } };
//         const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

//         return res.json({ message: 'Login successful!', token });
//     } catch (error) {
//         console.error('Login error:', error);
//         return res.status(500).json({ message: 'Server error during login' });
//     }
// };


// const profileData = (req, res) => {
//     const users = loadUsers();
//     const user = users.find(u => u.id === req.user.id);

//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }

//     return res.json({
//         id: user.id,
//         username: user.username,
//         message: `Welcome to your protected profile, ${user.username}!`
//     });
// };

// module.exports = { register, login, profileData };



const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const {
  findUserByPhone,
  addUser,
  updateUserPassword,
  loadUsers,
  updateUserOtp,
} = require('../models/userModel.js');
const { hashPassword, comparePassword } = require('../utils/hash.js');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// temporary OTP storage (in-memory for demo, use Redis in prod)
const otpStore = {};

/**
 * Step 1: Request OTP
 */
const requestOtp = (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // save OTP temporarily (you can also save it in user.json for persistence)
  otpStore[phone] = otp;

  console.log(`✅ OTP for ${phone}: ${otp}`); // in production, send via SMS gateway

  return res.json({ message: 'OTP sent successfully!' });
};

/**
 * Step 2: Verify OTP
 */
const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  if (otpStore[phone] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP verified, create a temporary user record
  let user = findUserByPhone(phone);
  if (!user) {
    addUser({ id: Date.now(), phone, password: null });
  }

  delete otpStore[phone]; // clear OTP after use

  return res.json({ message: 'OTP verified successfully!' });
};

/**
 * Step 3: Set Password
 */
const setPassword = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  const user = findUserByPhone(phone);
  if (!user) {
    return res.status(404).json({ message: 'User not found. Please verify OTP first.' });
  }

  const hashedPassword = await hashPassword(password);
  updateUserPassword(phone, hashedPassword);

  return res.json({ message: 'Password set successfully!' });
};

/**
 * Login
 */
const login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone and password are required' });
  }

  const user = findUserByPhone(phone);
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Invalid phone or password' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid phone or password' });
  }

  const payload = { user: { id: user.id, phone: user.phone } };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '72h' });

  return res.json({ message: 'Login successful!', token });
};

/**
 * Profile
 */
const profileData = (req, res) => {
  const users = loadUsers();
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    id: user.id,
    phone: user.phone,
    message: `Welcome to your profile, user with phone ${user.phone}!`,
  });
};

module.exports = { requestOtp, verifyOtp, setPassword, login, profileData };
