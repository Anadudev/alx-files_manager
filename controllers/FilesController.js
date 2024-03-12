import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FilesController = {
  // /files should create a new file in DB and in disk:
  postUpload: async (req, res) => {
    try {
      const { headers } = req;
      const { body } = req;
      const token = headers['x-token'];
      const user = await redisClient.get(redisClient);
      console.log(req);
      if (!body.name) {
        return res.status(400).json({ Error: 'Missing name' });
      }
      if (!body.type) {
        return res.status(400).json({ Error: 'Missing type' });
      }
      if (!body.data && body.type !== 'folder') {
        return res.status(400).json({ Error: 'Missing data' });
      }
      if (!user) {
        return res.status(401).json({ Error: 'Unauthorized' });
      }
    } catch (error) {
      console.log(`Error ${error}`);
    }
    return res;
  },
};
export default FilesController;
