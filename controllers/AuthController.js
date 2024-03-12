import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import { redisClient } from '../utils/redis';

const AuthController = {
  getConnect: async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Authorization header is present
      console.log('Authorization header:', authHeader);

      // Parse the header to extract credentials if needed
      const encodedCredentials = authHeader.split(' ')[1];
      const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      const [email, password] = decodedCredentials.split(':');

      try {
        const checkUser = await dbClient.client.db().collection('users').findOne({ email, password: sha1(password) });
        if (!checkUser) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        const token = `auth_${uuidv4()}`;
        console.log('TOKEN IS: ', token)
        console.log('USER ID IS: ', checkUser._id, checkUser);
        await redisClient.set(token, checkUser._id, 86400);
        res.status(200).json({ token: token.split('_')[1] });
      } catch (error) {
        console.log(`Some error occurred: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
  getDisconnect: async (req, res) => {
    const authHeaderToken = req.headers['x-token'];
    if (authHeaderToken) {
      // Authentication token is present
      console.log('Authorization header:', authHeaderToken);

      try {
        const checkToken = redisClient.get(`auth_${authHeaderToken}`);
        if (!checkToken) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        await redisClient.del(`auth_${authHeaderToken}`);
        res.status(204).send();
      } catch (error) {
        console.log(`Some error occurred: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
};
export default AuthController;
