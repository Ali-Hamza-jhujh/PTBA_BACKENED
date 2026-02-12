import redis from 'redis'
const redisclient=redis.createClient();
redisclient.on("error",(error)=>{console.log("Error in ridis",error)})
try {
  await redisclient.connect();
} catch (err) {
  console.error("Redis connection failed:", err);
}
export default redisclient
