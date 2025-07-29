require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false, 
  }
);
const User = sequelize.define('User', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

const Post = sequelize.define('Post', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  authorid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  imageurl: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

const Comment = sequelize.define('Comment', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  authorid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

const Likes = sequelize.define('Like', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

const Messages = sequelize.define('Message', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

const Friendships = sequelize.define('Friendship', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  requesterid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
  },
}, {
  timestamps: true,
});

//foreign keys from ChatGPT I Searched All the Internet Couldn't Find A Clue how to connect Those Tables  

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


(async () => {
  await sequelize.sync({ force: true });
  console.log('All tables created with foreign keys.');
})();


export {User , Sequelize}



/*
pgadmin instead of sqlite


KNOW WHAT IS REACT.JS
project React.js
understand what is component and how to seperate
component is container like div


tala write auth
me doing frontend and routes

*/