import express from 'express';
import { createPost, getPost, friendShip } from '../controller/postController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Create a new post (requires authentication)
router.post('/', authenticateToken, createPost);

// Get all posts (public)
router.get('/', getPost);

// Check if users are friends (requires authentication)
router.post('/check-friendship', authenticateToken, friendShip);

export default router; 