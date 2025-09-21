const { request } = require("express")
const dotenv = require('dotenv')
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

const validateRequest = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // The token is expected to be in the format "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({ message: 'Token format is incorrect, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add the user from the payload to the request object
        req.user = decoded.user;
        next(); // Proceed to the next middleware or the route handler
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}
module.exports = {validateRequest}