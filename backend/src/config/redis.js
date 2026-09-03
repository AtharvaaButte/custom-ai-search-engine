import { env } from "./env.js";
import { createClient } from "redis";

const redisClient = createClient({
  url: env.redisUrl
});

redisClient.on('error', (err) => {
  console.error('Redis Socket Warning:', err.message);
});

redisClient.on('connect', () => console.log('Connected to Redis RAM Cache'));

await redisClient.connect();

export default redisClient;