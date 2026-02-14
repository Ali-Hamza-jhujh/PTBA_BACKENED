import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisclient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'  
});

redisclient.on('connect', () => {
  console.log('✅ Redis: Connected successfully');
});

redisclient.on('error', (error) => {
  console.error('❌ Redis Error:', error.message);
});

try {
  await redisclient.connect();
  console.log('✅ Redis client is ready');
} catch (err) {
  console.error('❌ Redis connection failed:', err.message);
}

export default redisclient;