import { env } from "./env.js";
import { createClient } from "redis";


const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient.on('error', (err) => console.error('Redis Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis RAM Cache'));

await redisClient.connect();

export default redisClient;