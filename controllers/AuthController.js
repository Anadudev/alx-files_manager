import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';

export default AuthController = {
    getConnect: async (req, res) => {
        const token = req.headers['x-token'];
        if (!userId) {
            return res.status(401).json({Error:'Unauthorized'});
        }
        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Basic')) {
            return res.status(401).send('Unauthorized');
        }
    },
    getDisconnect: async (req, res) => { },
}
