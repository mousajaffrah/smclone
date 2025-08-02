import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';



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

export default Comment