import express from 'express';
const router = express.Router();
import { createPost, getPost } from '../controller/postController.js';
import { authenticateToken } from '../middlewares/auth.js';

// Get all posts (public)
router.get('/posts', getPost);

// Create a new post (requires authentication)
router.post('/posts', authenticateToken, createPost);

export default router; 