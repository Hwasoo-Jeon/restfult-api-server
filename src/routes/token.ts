import express, { NextFunction, Response, Request } from "express";
import {
  getPermissionsForRole,
  generateAccessToken,
  refreshToken,
  secretKey,
} from "../util/jwt-util";
import jwt from "jsonwebtoken";
const router = express.Router();
// roleData.json 파일의 구조에 맞춘 타입 정의

router.get(
  "/:role/refreshing",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (secretKey == undefined) {
        throw new Error("secretKey is Unloaded");
      }
      const userRole = req.params.role as string;
      const receivedToken = req.cookies.accessToken;
      console.log(userRole + "  " + receivedToken);
      const newToken = refreshToken(userRole, receivedToken);
      res.status(200).json({
        token: newToken,
      });
    } catch (error) {
      res.status(500).json({
        message: "Invalid Request",
      });
    }
  }
);

router.get(
  "/:role/verification",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (secretKey == undefined) {
        throw new Error("secretKey is Unloaded");
      }
      const receivedToken = req.cookies.accessToken;
      const decoding = jwt.verify(receivedToken, secretKey);

      res.status(200).json({
        result: decoding,
      });
    } catch (error) {
      res.status(500).json({
        message: "Invalid Request",
      });
    }
  }
);

router.get(
  "/:role/issuing",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (secretKey == undefined) {
        throw new Error("secretKey is Unloaded");
      }
      const userRole = req.params.role as string; //pathVariable.. params 대신 query 작성하면 쿼리변수
      const accessToken = generateAccessToken(userRole);
      res.cookie("accessToken", accessToken, {
        httpOnly: true, //script로 접근 불가, only http
        secure: false, // http가능, true=> https에서 사용
        sameSite: "strict", //같은도메인 외에는 쿠키 접근 불가
      });
      res.status(200).json({
        token: accessToken,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server is under maintenance",
      });
    }
  }
);

router.get(
  "/:role/check",
  (req: Request, res: Response, next: NextFunction) => {
    // 환경 변수를 사용하여 SUBMIT_URL 설정
    const userRole = req.params.role as string; //pathVariable.. params 대신 query 작성하면 쿼리변수
    const result = getPermissionsForRole(userRole);
    console.log(userRole);
    console.log(result);
    if (result) {
      res.status(200).json({
        code: 200,
        result: result,
      });
    } else {
      res.status(400).json({
        code: 400,
        message: "Invalid role",
      });
    }
  }
);

export default router;
