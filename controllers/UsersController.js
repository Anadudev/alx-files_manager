import sha1 from 'sha1';
import dbClient from '../utils/db';

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
};

export default UsersController;
