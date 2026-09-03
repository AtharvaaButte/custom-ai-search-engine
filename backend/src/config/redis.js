import { createClient } from 'redis';

// 1. Retrieve REDIS_URL or fallback to local development
let redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// 2. Ensure a valid protocol prefix is attached
if (!redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://')) {
  redisUrl = `redis://${redisUrl}`;
}

// 3. Configure socket options for SSL/TLS support on cloud hosts
const isSecure = redisUrl.startsWith('rediss://');

const redisClient = createClient({
  url: redisUrl,
  socket: {
    tls: isSecure ? true : undefined,
    rejectUnauthorized: false // Bypasses self-signed cert checks on cloud internal networks
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis successfully.'));

await redisClient.connect();

export default redisClient;