const { request } = require("express")
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()

// const JWT_SECRET = process.env.JWT_SECRET


// const validateRequest = (req, res, next) => {
//     console.log(req.header('authorization'), "---->")
//     const authHeader = req.header('Authorization');

//     // Check if token exists
//     if (!authHeader) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }

//     // The token is expected to be in the format "Bearer <token>"
//     const token = authHeader.split(' ')[1];
//     if(!token) {
//         return res.status(401).json({ message: 'Token format is incorrect, authorization denied' });
//     }
//     console.log(token,"=====>")

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, JWT_SECRET);

//         // Add the user from the payload to the request object
//         req.user = decoded.user;
//         next(); // Proceed to the next middleware or the route handler
//     } catch (error) {
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// }

// const validateRequest = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
//     const token = authHeader.split(' ')[1];

//     console.log(token, "validateRequest")
//     console.log(process.env.JWT_SECRET,"process.env.JWT_SECRET")
//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET);
//       console.log(payload,"payload")
//       req.user = payload;
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//   };

const validateRequest = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'No token provided' });
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid

      console.log(payload, "payload")
      req.user = payload.user; // this will now be { id, phone }
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  
  
module.exports = {validateRequest}