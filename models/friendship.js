import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';



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

export default Friendships