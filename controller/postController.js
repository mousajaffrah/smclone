import Post from '../models/post.js';
import User from '../models/User.js';
import Friendships from '../models/friendship.js';
import { Op } from 'sequelize';

const createPost = async (req , res) => {
try {
    const {content , imageurl} = req.body;
    const authorid = req.user.ID; 

if (!content){
        return res.status(400).json({ message: 'Content is required' });
}

    const newPost = await Post.create({
        authorid,
        content,
        imageurl: imageurl || null,
    })

    const postUser = await Post.findOne({
         where : { ID: newPost.ID },
         include: [{
           model: User,
           attributes: ['ID', 'username', 'avatar']
         }]
    })
    res.status(201).json({
      message: 'Post created successfully',
      post: postUser
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }


}

async function getPost(req,res){
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['ID', 'username', 'avatar']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            message: 'Posts retrieved successfully',
            posts
        });
    }
    catch (error){
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function friendShip(req, res) {
    try {
        const { user1Id, user2Id } = req.body;
        
        if (!user1Id || !user2Id) {
            return res.status(400).json({ message: 'Both user Ids are required' });
        }

        const user1 = await User.findByPk(user1Id);
        const user2 = await User.findByPk(user2Id);

        if (!user1 || !user2) {
            return res.status(404).json({ message: 'One or both users not found' });
        }

        const friends = await Friendships.findOne({
            where: {
                [Op.or]: [
                    { requesterid: user1Id, receiverid: user2Id , status: true },
                    { requesterid: user2Id, receiverid: user1Id , status: true }
                ]
            }
        });

        if (friends) {
            return res.status(400).json({ message: 'Users are friends' });

        }
                  
                
            }catch (error) {
                console.error('Error creating friendship:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        


export { createPost, getPost, friendShip };

