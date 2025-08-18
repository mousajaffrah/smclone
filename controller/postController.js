import Post from '../models/post.js';
import User from '../models/User.js';
// import Friendships from '../models/friendship.js';
// import { Op } from 'sequelize';

const createPost = (req, res) => {
    //content is mandatory and image is optional get them from the request
    const { content, imageurl } = req.body;
    //author id to add them then to post col then 
    //so we take the userid and save its value in authorid
    const authorid = req.user?.ID || 1; // Use default user ID 1 if not authenticated

    //if the user didn't add any content in post it won't go to database
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    //we create the post in the database as col as i said
    //authorid = user.id that created the post
    //content whats in the post
    //imageurl is optional if it is empty add a null value
    Post.create({
        authorid,
        username,
        content,
        imageurl: imageurl || null,
    })
    //if it worked didn't fail?
    //then we call the new post from DB
    .then(newPost => {
        return Post.findOne({
            // we call the post id 
            where: { ID: newPost.ID },
            //here we mean include this post to this user
            include: [{
                model: User,
                //we return those attributes
                attributes: ['ID', 'username', 'avatar']
            }]
        });
    })
    //if everything okay !
    //we send info for posts and user
    // and return it in frontend
    .then(postUser => {
        res.status(201).json({
            message: 'Post created successfully',
            post: postUser
        });
    })
    //if any step returned err then it will catch err
    .catch(error => {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
}

const getPost = (req, res) => {
    //we get all posts to the dashboard with all ids and username and avatar
    Post.findAll({
        include: [{
            model: User,
            attributes: ['ID', 'username', 'avatar']
        }],
        //and order them by time created from the newest to oldest 
        //descinding
        order: [['createdAt', 'DESC']]
    })
    //we return the ok status and return all posts 
    .then(posts => {
        res.status(200).json({
            message: 'Posts retrieved successfully',
            posts
        });
    })
    //catch the error if any step have a error
    .catch(error => {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
}

export default { createPost, getPost };


//change from local host to public ip

