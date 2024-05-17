import csurf from "csurf";
import jwt from "jsonwebtoken";
import { createClient, RedisClientType } from "redis";
import express, { Request, Response, NextFunction } from "express";

const secure = {
  redisClient: createClient({
    socket: {
      port: Number(process.env.REDIS_PORT),
      host: "localhost",
    },
  }),
  // csrf token 검증(cookie에 담긴 JWT accessToken, refreshToken을 활용)
  checkSecretKey: () => {
    const secretKey = process.env.SECRET_KEY;
    if (secretKey === undefined) {
      throw new Error("SecretKey is undefined");
    }
    return secretKey;
  },
  // csurf: CSRF 공격 방지용 middleware
  // token이 저장된 cookie를 csrf용 token으로 사용
  csrfProtection: csurf({
    cookie: { httpOnly: true, sameSite: "strict", maxAge: 10 },
  }),

  // accessToken 유효성 검증, (false : refreshToken 검증)
  // 검증후 passport-jwt로 넘기기에 accessToken 설정해야함
  jwtTokenVerify: async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (!req.cookies.accessToken && !req.cookies.refreshToken) {
      return res.status(200).json({
        status: 403,
        success: false,
        message: "Authentication token is invalid. Login or Retry",
      });
    }

    try {
      // accessToken으로 권한 검증
      token = req.cookies.accessToken;
      await jwt.verify(token, secure.checkSecretKey());
      next();
    } catch (error) {
      console.log(error);
      // (accessToken 실패 분기)
      // accessToken을 cookie에서 삭제
      res.clearCookie("accessToken");

      try {
        // refreshToken으로 권한 검증 및 payload에서 userid 추출
        token = req.cookies.refreshToken;
        const decode = jwt.verify(token, secure.checkSecretKey());

        // verify 반환 타입 확인해야함
        if (typeof decode !== "string" && "userId" in decode) {
          const { userId } = decode;
          // userid를 가지고, redis의 refreshToken 유효성 체크
          await secure.redisClient.connect();
          const redis_refreshToken = await secure.redisClient.get(userId);
          console.log(decode);
          await secure.redisClient.disconnect(); // 사용 후 연결 해제

          if (!redis_refreshToken) {
            throw new Error("Invalid Token"); // res.json으로 대체 가능한지 확인
          }

          //accessToken 재발행
          let accessToken = jwt.sign(decode, secure.checkSecretKey());
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 1000, //밀리세컨드 (60*1초)
          });

          req.cookies.accessToken = accessToken;

          next();
        } else {
          return res.status(403).json({
            status: 403,
            success: false,
            message: "Try again",
          });
        }
      } catch (error) {
        console.log(error);
        // (refreshToken 실패 분기)
        res.status(403).json({
          status: 403,
          success: false,
          message: "Please sign in",
        });
      }
    }
  },
};

export default secure;
