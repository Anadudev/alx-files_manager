import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FilesController = {
  postUpload: async (req, res) => {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ Error: 'Missing name' });
      }
      const user = await redisClient.get(`auth_${token}`);
      const {
        name, type, parentId = 0, isPublic = false, data,
      } = req.body;
      if (!name) {
        return res.status(400).json({ Error: 'Missing name' });
      }
      if (!type) {
        return res.status(400).json({ Error: 'Missing type' });
      }
      if (!data && type !== 'folder') {
        return res.status(400).json({ Error: 'Missing data' });
      }
      if (parentId !== 0) {
        const parentFile = await dbClient.db().collection('files').findOne({ id: parentId });
        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }
      let localPath = '';
      if (type !== 'folder') {
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
        const fileUuid = uuidv4();
        localPath = path.join(folderPath, fileUuid);
        fs.writeFileSync(localPath, Buffer.from(data, 'base64'));
      }
      const newFile = {
        user,
        name,
        type,
        isPublic,
        parentId,
        localPath: type !== 'folder' ? localPath : undefined,
      };
      const result = await dbClient.db().collection('files').insertOne(newFile);
      return res.status(201).json({ newFile, id: result.insertedId });
    } catch (error) {
      console.log(`Error ${error}`);
    }
  },
};

export default FilesController;
