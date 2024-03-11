import redis from 'redis';
import util from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        // Promisify Redis client methods
        this.getAsync = util.promisify(this.client.get).bind(this.client);
        this.setAsync = util.promisify(this.client.set).bind(this.client);
        this.delAsync = util.promisify(this.client.del).bind(this.client);

        // Listen for errors
        this.client.on('error', (err) => {
            console.error(err);
        });
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        try {
            const value = await this.getAsync(key);
            return value;
        } catch (error) {
            console.error('Error getting value from Redis:', error);
            return null;
        }
    }

    async set(key, value, durationInSeconds) {
        try {
            await this.setAsync(key, value, 'EX', durationInSeconds);
        } catch (error) {
            console.error('Error setting value in Redis:', error);
        }
    }

    async del(key) {
        try {
            await this.delAsync(key);
        } catch (error) {
            console.error('Error deleting value from Redis:', error);
        }
    }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
