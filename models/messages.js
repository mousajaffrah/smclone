import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';



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

export default Messages