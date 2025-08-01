import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

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

export default User; 