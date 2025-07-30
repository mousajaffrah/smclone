import { RegisterUser, LoginUser } from "./controller/authController.js";
import cors from 'cors';
import express from 'express';

const app = express();

const port = 3001;

app.use(cors({
    origin: '*',
    credentials: true
}));

app.post('/login', LoginUser);

app.post('/register', RegisterUser);

try {
    app.listen(port, () => {
        console.log('listening on port: ', port)
    })
} catch (err) {
    console.error(err)
}

