import sequelize from './sequelize.js';
// Import models and associations
import './foreignkey.js';

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); 
    console.log('All tables created with foreign keys.');
  } catch (error) {
    console.error('Database init failed:', error);
  }
};

export default initializeDatabase;
