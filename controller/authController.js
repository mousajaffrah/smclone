import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function RegisterUser(req, res) {
  const user = req.body;
  const password = req.body.password || req.body.password_hash;
  const username = user.username || user.name;

  if (!username || !user.email || !password) {
    return res.status(400).json({
      message: 'Missing required fields: username/name, email, and password are required'
    });
  }

  try {
    const usrExists = await User.findOne({
      where: { username: username },
    });

    if (usrExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const saltRounds = 10;
    const password_hashed = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username: username,
      email: user.email,
      password_hash: password_hashed,
      avatar: user.avatar || null,
      bio: user.bio || null,
    });

    const token = jwt.sign(
      { id: newUser.ID, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 6 * 60 * 60 * 1000
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function LoginUser(req, res) {
  const user = req.body;
  const username = user?.username || user?.name || user?.email;
  const password = user?.password || user?.password_hash;

  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Missing required fields: username/name/email and password are required'
    });
  }

  try {
    let usrExists = await User.findOne({
      where: { username: username },
    });

    if (!usrExists) {
      usrExists = await User.findOne({
        where: { email: username },
      });
    }

    if (!usrExists) {
      return res.status(400).json({ message: 'User doesn\'t exist' });
    }

    const match = await bcrypt.compare(password, usrExists.password_hash);
    
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: usrExists.ID, username: usrExists.username },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 6 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export { RegisterUser, LoginUser };
