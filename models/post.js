import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

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
    allowNull: false,
  },
  imageurl: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

export default Post