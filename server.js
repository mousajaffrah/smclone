import { RegisterUser, LoginUser } from "./controller/authController.js";
import initializeDatabase from "./models/initializeDatabase.js";
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3001;

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true
}));
app.use(express.json());

app.post('/login', LoginUser);
app.post('/register', RegisterUser);

initializeDatabase();

app.listen(port, () => {
    console.log('Server running on port:', port);
});

