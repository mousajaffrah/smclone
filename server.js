// import { User } from "./models/schema.js"
import { RegisterUser,LoginUser } from "./controller/authController.js";
// const { Sequelize, DataTypes } = require('sequelize')

// const url = require('url');
const cors = require('cors');
const express = require('express');

const app = express();

const port = 3001;

app.use(cors({
    origin: '*',
    credentials: true
}));

app.post('/login', LoginUser)

app.post('/register', RegisterUser())

try {
    app.listen(port, () => {
        console.log('listening on port: ', port)
    })
} catch (err) {
    console.error(err)
}

