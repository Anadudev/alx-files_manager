
/**
 * DBClient is a class that handles database operations such as connecting to the database,
 * checking if the database connection is alive, and counting documents in collections.
 * @module utils/DBClient
 */

import { MongoClient } from 'mongodb';
/**
 * ABClient class that handles connection to the mongo database server
 * @class
 */
class DBClient {
  /**
   * A constructor of DBClient.
   * @constructor
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(url);
    this.client.connect();
  }

  /**
   * Checks if the database connection is alive.
   * @returns {boolean} True if the connection is alive, false otherwise.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Counts the total number of users in the 'users' collection.
   * @async
   * @returns {Promise<number>} The total number of users.
   */
  async nbUsers() {
    const totalUsers = await this.client.collection('users').countDocuments();
    return totalUsers;
  }

  /**
   * Counts the total number of files in the 'files' collection.
   * @async
   * @returns {Promise<number>} The total number of files.
   */
  async nbFiles() {
    const filesCount = await this.client.collection('files').countDocuments();
    return filesCount;
  }
}

/**
 * exporting an instance of dbClient class
 * @type {DBClient}
 */
const dbClient = new DBClient();
export default dbClient;
