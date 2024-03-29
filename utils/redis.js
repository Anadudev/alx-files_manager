import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient()
      .on('error', (error) => {
        console.log(`${error.message}`);
      });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const value = await promisify(this.client.GET).bind(this.client)(key);
    return (value);
  }

  async set(key, value, duration) {
    await promisify(this.client.SET).bind(this.client)(key, value, 'EX', duration);
  }

  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
