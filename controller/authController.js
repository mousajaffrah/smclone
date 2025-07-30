import { Sequelize, User } from "./models/schema.js"

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT
const axios = require('axios'); // same as fetch
const User = require('./models/schema.js');
require('dotenv').config(); // used to load environment variables from a .env file into process.env in Node.js
/*dotenv is a popular Node.js package that reads a .env file in the root of your project and loads the environment variables defined in that file into process.env.
The call to require('dotenv').config() initializes dotenv and loads the variables so that anywhere in your code you can access them via process.env.VARIABLE_NAME.
In this file, process.env.USER_SERVICE_URL and process.env.JWT_SECRET are used, which are expected to be defined in the .env file.

The .env file is not a JavaScript or Node.js module, so you cannot require it directly like a JS file.
The .env file is a plain text file with key=value pairs, not executable code.
The dotenv package parses this file and loads the variables into process.env at runtime.
This approach keeps sensitive configuration like secrets and URLs out of the source code and allows different environment configurations without changing code.
So, require('dotenv').config() is the standard way to load environment variables from a .env file in Node.js projects.
*/

const USER_URL = 'http://localhost:8080'; // user microservice URL OR  process.env.USER_SERVICE_URL 

async function RegisterUser(req, res) {
  const user = req.body;

  try {
    // Check if username exists
    // const userExists = await axios.get(USER_URL + '/users/exists?username=' + username);

    const usrExists = await User.findOne({
      where: { username: user.username, },
    });

    if (usrExists) {
      console.log('User already exists'); // , user.toJSON()
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
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
      password_hash: password_hash,
      avatar: user.avatar ? user.avatar : null,
      bio: user.bio ? user.bio : null,
    })

    // generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username }, // payload
      process.env.JWT_SECRET, // secret key was generated: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
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
    const match = await bcrypt.compare(usrExists.password_hash, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username }, //payload
      process.env.JWT_SECRET, // secret
      { expiresIn: '6h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// module.exports = {
//   registerUser,
//   loginUser,
// };

export { RegisterUser, LoginUser }
