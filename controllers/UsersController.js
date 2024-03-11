/**
 * UsersController handles user-related operations such as creating a new user.
 * @module controllers/UsersController
 */

import dbClient from "../utils/db";
import sha1 from 'sha1';

/**
 * creates a userController object
 * @exports UsersController
 * @type {Object}
 */

export default UsersController = {
  /**
 * Handles the creation of a new user.
 * @async
 * @function postNew
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
  postNew: async (req, res) => {
    const body = req.body;
    if (!body.email) {
      // if email is empty
      res.status(400).json({ error: 'Missing email' });
      return;
    }

    if (!body.password) {
      // if user password is missing
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const email = body.email;
    const password = body.password;
    const checkEmail = await dbClient.client.collection('users').findOne({ email: email });
    if (checkEmail) {
      // checking if current user email already exists
      res.status(400).json({ error: 'Already exist' });
      return;
    }

    const user = await dbClient.collection('user')
      .insertOne({ email, password: sha1(password) });
    const userId = user.insertedId.toString();
    res.status(201).json({ email, id: userId });
  }
}
