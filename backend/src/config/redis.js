import { createClient } from 'redis';

const getCleanRedisUrl = () => {
  let rawUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  // 1. Trim whitespace, quotes, and trailing slashes/newlines
  let cleaned = rawUrl.trim().replace(/^["']|["']$/g, '');

  // 2. Ensure scheme prefix
  if (!cleaned.startsWith('redis://') && !cleaned.startsWith('rediss://')) {
    cleaned = `redis://${cleaned}`;
  }

  // 3. Parse URL safely to sanitize invalid pathnames
  try {
    const parsed = new URL(cleaned);
    // Redis URL pathname must be empty, '/', or integer database index like '/0'
    if (parsed.pathname && parsed.pathname !== '/' && !/^\/\d+$/.test(parsed.pathname)) {
      console.warn(`Sanitizing invalid Redis URL pathname "${parsed.pathname}" -> reset to root`);
      parsed.pathname = '';
    }
    return parsed.toString();
  } catch (err) {
    console.warn(`Redis URL parsing fallback for "${cleaned}":`, err.message);
    return cleaned;
  }
};

const redisUrl = getCleanRedisUrl();
const isSecure = redisUrl.startsWith('rediss://');

const redisClient = createClient({
  url: redisUrl,
  socket: {
    tls: isSecure ? true : undefined,
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => console.error('Redis Error:', err.message || err));
redisClient.on('connect', () => console.log('Connected to Redis successfully.'));

try {
  await redisClient.connect();
} catch (err) {
  console.error('Failed to connect to Redis:', err.message);
}

export default redisClient;