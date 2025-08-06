import Post from '../models/post.js';
import User from '../models/User.js';
import Friendships from '../models/friendship.js';
import { Op } from 'sequelize';

const createPost = (req, res) => {
    const { content, imageurl } = req.body;
    const authorid = req.user.ID;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    Post.create({
        authorid,
        content,
        imageurl: imageurl || null,
    })
    .then(newPost => {
        return Post.findOne({
            where: { ID: newPost.ID },
            include: [{
                model: User,
                attributes: ['ID', 'username', 'avatar']
            }]
        });
    })
    .then(postUser => {
        res.status(201).json({
            message: 'Post created successfully',
            post: postUser
        });
    })
    .catch(error => {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
}

const getPost = (req, res) => {
    Post.findAll({
        include: [{
            model: User,
            attributes: ['ID', 'username', 'avatar']
        }],
        order: [['createdAt', 'DESC']]
    })
    .then(posts => {
        res.status(200).json({
            message: 'Posts retrieved successfully',
            posts
        });
    })
    .catch(error => {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
}

export { createPost, getPost };