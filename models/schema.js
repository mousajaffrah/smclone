const { Sequelize, DataTypes } = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');

const sequelize = new Sequelize('sqlite::memory:');

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


User.hasMany(Post, { foreignKey: 'authorid', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorid' });

User.hasMany(Comment, { foreignKey: 'authorid', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'authorid' });

Post.hasMany(Comment, { foreignKey: 'postid', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postid' });

User.hasMany(Like, { foreignKey: 'userid', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userid' });

Post.hasMany(Like, { foreignKey: 'postid', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postid' });

User.hasMany(Message, { foreignKey: 'senderid', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'receiverid', as: 'ReceivedMessages' });

Message.belongsTo(User, { foreignKey: 'senderid', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiverid', as: 'Receiver' });

User.hasMany(Friendship, { foreignKey: 'requesterid', as: 'RequestsSent' });
User.hasMany(Friendship, { foreignKey: 'receiverid', as: 'RequestsReceived' });

Friendship.belongsTo(User, { foreignKey: 'requesterid', as: 'Requester' });
Friendship.belongsTo(User, { foreignKey: 'receiverid', as: 'Receiver' });


(async () => {
  await sequelize.sync({ force: true });
  console.log('All tables created with foreign keys.');
})();