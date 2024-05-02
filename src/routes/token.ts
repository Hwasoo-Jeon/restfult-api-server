import express, { NextFunction, Response, Request } from "express";
import roleDataJson from "../role.json";
import jwt from "jsonwebtoken";
import { access } from "fs";

const router = express.Router();
// roleData.json 파일의 구조에 맞춘 타입 정의
interface RoleData {
  role: {
    [key: string]: string;
  };
  authorization: {
    [key: string]: string[];
  };
}
/*
interface Roles {
  super: number;
  admin: number;
  member: number;
}

interface Authorization {
  super: string[];
  admin: string[];
  member: string[];
}

interface RoleData {
  role: Roles;
  authorization: Authorization;
}
*/

const roleData: RoleData = roleDataJson;
// const roleData = roleDataJson as {
//   role: {
//     [key: string]: string; // 인덱스 서명 추가
//   };
//   authorization: {
//     [key: string]: string[];
//   };
// }; //위처럼 사용

function getPermissionsForRole(inputRole: string): string[] | undefined {
  // 입력받은 role이 유효한지 확인
  if (inputRole in roleData.role) {
    // role에 해당하는 인덱스를 찾아 권한 배열을 반환
    const roleDescription = roleData.role[inputRole];
    // 해당 역할에 대한 권한 추출
    const permissions = roleData.authorization[inputRole];
    // 역할 설명과 권한을 배열에 담아 반환
    return [roleDescription, ...permissions];
  } else {
    // 유효하지 않은 role의 경우
    return undefined;
  }
}

if (typeof process.env.SECRET_KEY === undefined) {
  throw new Error("SECRET_KEY is not defined in the environment variables.");
}
const secretKey = process.env.SECRET_KEY || "defaultKey";

function generateAccessToken(role: string) {
  console.log(secretKey);
  const payload = { username: role };
  const token = jwt.sign(payload, secretKey);

  return token;
}

router.get(
  "/token/:role",
  (req: Request, res: Response, next: NextFunction) => {
    // 환경 변수를 사용하여 SUBMIT_URL 설정
    const userRole = req.params.role as string; //pathVariable.. params 대신 query 작성하면 쿼리변수
    const roleResult = getPermissionsForRole(userRole);
    const issueResult = generateAccessToken(userRole);
    res.status(200).json({
      role: roleResult,
      accessToken: issueResult,
    });
  }
);

router.get("/role/:role", (req: Request, res: Response, next: NextFunction) => {
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
});

export default router;
