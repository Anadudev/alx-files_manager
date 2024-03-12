import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import { redisClient } from '../utils/redis';

const UsersController = {
  postNew: async (req, res) => {
    const { body } = req;
    if (!body.email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!body.password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const { email, password } = body;
    try {
      const checkEmail = await dbClient.client.db().collection('users').findOne({ email });
      if (checkEmail) {
        res.status(400).json({ error: 'Already exist' });
        return;
      }

      const user = await dbClient.client.db().collection('users').insertOne({ email, password: sha1(password) });
      const userId = user.insertedId.toString();
      res.status(201).json({ email, id: userId });
    } catch (error) {
      console.log(`Some error occurred: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getMe: async (req, res) => {
    const authHeaderToken = req.headers['x-token'];
    if (authHeaderToken) {
      // Authentication token is present
      console.log('Authorization header:', authHeaderToken);

      try {
        const _id = await redisClient.get(`auth_${authHeaderToken}`);
        console.log('my id is:');
        console.log(_id, `auth_${authHeaderToken}`);
        if (!_id) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }
        const getUser = await dbClient.client.db().collection('users').findOne({ _id: new ObjectId(_id) });
        console.log('user, ', getUser);
        const { email } = getUser;
        res.status(200).json({ id: getUser._id, email });
      } catch (error) {
        console.log(`Some error occurred: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
    console.log(req.headers);
  },
};

export default UsersController;
