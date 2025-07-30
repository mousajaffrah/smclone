import express from 'express';
const router = express.Router();
import { RegisterUser, LoginUser } from '../controller/authController';

router.post('/register', RegisterUser);
router.post('/login', LoginUser);
export { router }