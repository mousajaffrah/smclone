import User from '../models/User.js';
import Friendships from '../models/friendship.js';
import { Op } from 'sequelize';

const friendShip = async (req, res) => {
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

        // Create friendship request
        const newFriendship = await Friendships.create({
            requesterid: user1Id,
            receiverid: user2Id,
            status: false // pending request
        });

        res.status(201).json({
            message: 'Friendship request sent successfully',
            friendship: newFriendship
        });
                  
    } catch (error) {
        console.error('Error creating friendship:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default friendShip;