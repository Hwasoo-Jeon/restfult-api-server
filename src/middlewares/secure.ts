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
    cookie: { httpOnly: true, sameSite: "strict" },
  }),

  csrfTokenVerify: async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.cookies.hasOwnProperty("accessToken") ||
      req.cookies.hasOwnProperty("refreshToken")
    ) {
      return res.status(200).json({
        status: 403,
        success: false,
        message: "Authentication token is invalid",
      });
    }

    try {
      // accessToken으로 권한 검증
      token = req.cookies.accessToken;
      await jwt.verify(token, secure.checkSecretKey());
      next();
    } catch (error) {
      // (accessToken 실패 분기)
      // accessToken을 cookie에서 삭제
      res.clearCookie("accessToken");

      try {
        //  refreshToken으로 권한 검증 및 payload에서 userid 추출
        token = req.cookies.refreshToken;
        const decode = jwt.verify(token, secure.checkSecretKey());

        if (typeof decode !== "string" && "userid" in decode) {
          const { userid } = decode;
          // userid를 가지고, redis의 refreshToken 확인
          const redis_refreshToken = await secure.redisClient.get(userid);
          if (!redis_refreshToken || redis_refreshToken != token) {
            throw new Error("Invalid Token");
          }

          //accessToken 재발행
          let accessToken = jwt.sign(decode, secure.checkSecretKey());
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 1000, //밀리세컨드
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
