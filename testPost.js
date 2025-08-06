import Post from '../models/post.js';
import User from '../models/User.js';

// Create a new post
const createPost = async (req, res) => {
  try {
    const { content, imageurl } = req.body;
    const authorid = req.user.ID; // Get user ID from authenticated request

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newPost = await Post.create({
      authorid,
      content,
      imageurl: imageurl || null,
    });

    // Fetch the post with user information
    const postWithUser = await Post.findOne({
      where: { ID: newPost.ID },
      include: [{
        model: User,
        attributes: ['ID', 'username', 'avatar']
      }]
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: postWithUser
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all posts
const getPosts = async (req, res) => {
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
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findByPk(id, {
      include: [{
        model: User,
        attributes: ['ID', 'username', 'avatar']
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
      message: 'Post retrieved successfully',
      post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, imageurl } = req.body;
    const authorid = req.user.ID;

    const post = await Post.findByPk(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.authorid !== authorid) {
      return res.status(403).json({ message: 'You can only update your own posts' });
    }

    await post.update({
      content: content || post.content,
      imageurl: imageurl !== undefined ? imageurl : post.imageurl,
    });

    res.status(200).json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const authorid = req.user.ID;

    const post = await Post.findByPk(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.authorid !== authorid) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await post.destroy();

    res.status(200).json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
async function friendShip(req, res) {
  try {
      const { user1Id, user2Id } = req.body;
      
      if (!user1Id || !user2Id) {
          return res.status(400).json({ message: 'Both user IDs are required' });
      }

      // Check if users exist
      const user1 = await User.findByPk(user1Id);
      const user2 = await User.findByPk(user2Id);
      
      if (!user1 || !user2) {
          return res.status(404).json({ message: 'One or both users not found' });
      }

      // Check for friendship in both directions (since friendship can be initiated by either user)
      const friendship = await Friendships.findOne({
          where: {
              [Op.or]: [
                  {
                      requesterid: user1Id,
                      receiverid: user2Id,
                      status: true
                  },
                  {
                      requesterid: user2Id,
                      receiverid: user1Id,
                      status: true
                  }
              ]
          }
      });

      if (friendship) {
          res.status(200).json({
              message: 'Users are friends',
              areFriends: true,
              friendship: {
                  id: friendship.ID,
                  requesterId: friendship.requesterid,
                  receiverId: friendship.receiverid,
                  status: friendship.status,
                  createdAt: friendship.createdAt
              }
          });
      } else {
          res.status(200).json({
              message: 'Users are not friends',
              areFriends: false
          });
      }
  } catch (error) {
      console.error('Error checking friendship:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

export { createPost, getPosts, getPostById, updatePost, deletePost };  