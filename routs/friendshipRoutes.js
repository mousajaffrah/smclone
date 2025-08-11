import express from 'express';
const router = express.Router();
import friendShip from '../controller/friendshipController.js';
import { authenticateToken } from '../middlewares/auth.js';

// Create friendship request (requires authentication)
router.post('/friendship', authenticateToken, friendShip);

export default router; 