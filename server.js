import { RegisterUser, LoginUser, getUsers } from "./controller/authController.js";
import initializeDatabase from "./models/initializeDatabase.js";
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import postController from "./controller/postController.js"
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

app.post('/posts', postController.createPost);
app.get('/posts', postController.getPost);

app.get('/all', getUsers)

initializeDatabase();

app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port:', port);
});
