import { createClient } from 'redis';

let redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Ensure valid scheme
if (!redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://')) {
  redisUrl = `redis://${redisUrl}`;
}

const isSecure = redisUrl.startsWith('rediss://');

const redisClient = createClient({
  url: redisUrl,
  socket: {
    tls: isSecure ? true : undefined,
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

await redisClient.connect();
export default redisClient;