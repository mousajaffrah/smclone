import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // used to load environment variables from a .env file into process.env in Node.js
require('dotenv').config();

const authenticateToken = (req, res, next) => { // call it at every req func?
  const authHeader = req.headers['authorization']; // authorization : Bearer <token>
  var token;
  if (authHeader) token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Access token missing' }); //redirect to login

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' }); // redirect to login
    req.user = user;
    next(); // redirect to home "/"
  });
};

export {authenticateToken};
