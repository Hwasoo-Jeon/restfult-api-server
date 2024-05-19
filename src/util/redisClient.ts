import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
  socket: {
    port: Number(process.env.REDIS_PORT),
    host: "localhost",
  },
});
redisClient
  .connect()
  .then(() => console.log("Redis connected"))
  .catch((err) => console.error("Redis connection error:", err));

export default redisClient;
