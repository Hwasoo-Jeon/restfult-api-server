import { createClient, RedisClientType } from "redis";
import express, { Request, Response, NextFunction } from "express";
import secure from "../middlewares/secure";

// const redisClient: RedisClientType = createClient({
//   socket: {
//     // port: Number(process.env.REDIS_PORT),
//     port : 6379,
//     host: "localhost",
//   },
// });
// //Connect Console
// redisClient.on("connect", () => {
//   console.info("Redis connected!");
// });
// //Error Console
// redisClient.on("error", (err) => {
//   console.error("Redis Client Error", err);
// });
// // redis v4 연결 (비동기)
// redisClient.connect().then();

const router = express.Router();

router.post(
  "/",
  secure.csrfProtection,
  secure.jwtTokenVerify,
  (req: Request, res: Response, next: NextFunction) => {
    console.log("jwtTokenVerify success");
    res.status(200).json({
      status: 200,
      success: true,
      message: "Authorization success",
    });
  }
);

export default router;
