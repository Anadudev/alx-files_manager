import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(url);
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const totalUsers = await this.client.collection('users').countDocuments;
    return (totalUsers);
  }

  async nbFiles() {
    const filesCount = await this.client.collection('files').countDocuments;
    return (filesCount);
  }
}

const dbClient = new DBClient();
export default dbClient;
