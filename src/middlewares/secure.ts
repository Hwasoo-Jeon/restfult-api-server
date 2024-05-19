import csurf from "csurf";
import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";
import redisClient from "../util/redisClient";

const secure = {
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
    cookie: { httpOnly: true, sameSite: "strict", maxAge: 60 * 60 },
  }),

  // accessToken 유효성 검증, (false : refreshToken 검증)
  // 검증후 passport-jwt로 넘기기에 accessToken 설정해야함
  jwtTokenVerify: async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (!req.cookies.accessToken && !req.cookies.hashedToken) {
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
        // hashedToken의 redis 검색 후, refreshToken의 유효성 검증 및 payload에서 userid 추출
        token = req.cookies.hashedToken;
        const redis_refreshToken = await redisClient.get(token);

        // (redis의 refreshToken 무효)
        if (!redis_refreshToken) {
          return res.status(403).json({
            status: 403,
            success: false,
            message: "Try again or Login",
          });
        }
        console.log(redis_refreshToken);

        const decode = await jwt.verify(
          redis_refreshToken,
          secure.checkSecretKey()
        );

        // verify 반환 타입 확인 후, 예외상황 체크
        if (typeof decode !== "string" && "userId" in decode) {
          // const { userId } = decode;
          // userId를 가지고 추가적인 검증 절차 진행 (예: 사용자 식별, 권한 확인 등)
          // 절차 생략

          //accessToken 재발행
          let accessToken = jwt.sign(decode, secure.checkSecretKey());
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 5 * 1000, // 5초
          });
          next();
        } else {
          return res.status(403).json({
            status: 403,
            success: false,
            message: "Try again or Login",
          });
        }
      } catch (error) {
        console.log(error);
        // (보유 token이 없는 분기)
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
