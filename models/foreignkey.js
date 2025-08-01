import dotenv from 'dotenv';
dotenv.config();

import User from './User.js'
import Comment from './comment.js'
import Friendships from './friendship.js'
import Likes from './like.js'
import Messages from './messages.js'
import Post from './post.js'
import sequelize from './sequelize.js';


//Many to One
User.hasMany(Post, { foreignKey: 'authorid', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorid' });

User.hasMany(Comment, { foreignKey: 'authorid', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'authorid' });

Post.hasMany(Comment, { foreignKey: 'postid', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postid' });

User.hasMany(Likes, { foreignKey: 'userid', onDelete: 'CASCADE' });
Likes.belongsTo(User, { foreignKey: 'userid' });

Post.hasMany(Likes, { foreignKey: 'postid', onDelete: 'CASCADE' });
Likes.belongsTo(Post, { foreignKey: 'postid' });

User.hasMany(Messages, { foreignKey: 'senderid', as: 'SentMessages' });
User.hasMany(Messages, { foreignKey: 'receiverid', as: 'ReceivedMessages' });

//One to One
Messages.belongsTo(User, { foreignKey: 'senderid', as: 'Sender' });
Messages.belongsTo(User, { foreignKey: 'receiverid', as: 'Receiver' });

//Many to Many
User.hasMany(Friendships, { foreignKey: 'requesterid', as: 'RequestsSent' });
User.hasMany(Friendships, { foreignKey: 'receiverid', as: 'RequestsReceived' });

Friendships.belongsTo(User, { foreignKey: 'requesterid', as: 'Requester' });
Friendships.belongsTo(User, { foreignKey: 'receiverid', as: 'Receiver' });



export { User, Comment, Friendships, Likes, Messages, Post, sequelize };
