import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // JWT
import axios from 'axios'; // same as fetch
import User from '../models/User.js'

import dotenv from 'dotenv';
dotenv.config(); // used to load environment variables from a .env file into process.env in Node.js

const USER_URL = 'http://localhost:8080'; // user microservice URL OR  process.env.USER_SERVICE_URL 

async function RegisterUser(req, res) {
  const user = req.body;

  const password = req.body.password || req.body.password_hash;

  console.log('Registration request body:', user);
  console.log('Password:', password);

  // Validate required fields
  if (!user.username || !user.email || !password) {
    return res.status(400).json({ 
      message: 'Missing required fields: username, email, and password are required' 
    });
  }

  try {


    const usrExists = await User.findOne({
      where: { username: user.username, },
    });

    if (usrExists) {
      console.log('User already exists'); // , user.toJSON()
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    console.log('About to hash password:', password, 'with salt rounds:', saltRounds);
    const password_hashed = await bcrypt.hash(password, saltRounds);
    /*Salt in hashing is a random value added to the input before hashing it. The purpose of 
    using salt is to ensure that even if two users have the same password, their hashed passwords 
    will be different due to the unique salt value. This protects against attacks such as rainbow
    table attacks, where precomputed hash values are used to reverse-engineer passwords. 
    In the code, saltRounds = 10 
    means bcrypt will generate a salt with 10 rounds of processing, making the hash 
    computation slower and more secure. */

    // save user 
    const newUser = await User.create({
      username: user.username,
      email: user.email,
      password_hash: password_hashed,
      avatar: user.avatar ? user.avatar : null,
      bio: user.bio ? user.bio : null,
    })

    // generate JWT token
    console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
    console.log('New user data:', { id: newUser.ID, username: newUser.username });
    
    const token = jwt.sign(
      { id: newUser.ID, username: newUser.username }, // payload
      process.env.JWT_SECRET, // secret key was generated: node -e "console.log(require('crypto').randomBytes(32).randomBytes(32).toString('hex'))"
      { expiresIn: '6h' }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function LoginUser(req, res) {
  const user = req.body;

  try {
    // Get user info from db
    const usrExists = await User.findOne({
      where: { username: user.username, },
    });

    if (!usrExists) {
      return res.status(400).json({ message: 'User doesnt exist' });
    }

    // Compare password
    const match = await bcrypt.compare(user.password, usrExists.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: usrExists.ID, username: usrExists.username }, //payload
      process.env.JWT_SECRET, // secret
      { expiresIn: '6h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { RegisterUser, LoginUser };