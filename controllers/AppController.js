import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export default AppController = {
  getStatus: async (req, res) => {
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  },
  getStats: async (req, res) => {
    const userCount = await countUsers();
    const fileCount = await countFiles();
    res.status(200).json({ users: userCount, files: fileCount });
  },
};