import express, { NextFunction, Response, Request } from "express";
import roleDataJson from "../role.json";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

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

interface resStructure {
  [key: string]: string;
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

// 일회성 변수가 전역적으로 남는 것을 방지하기 위해 익명함수로 스코프를 제한함
// (() => {
//   const result = dotenv.config({ path: path.join(__dirname, "..", ".env") }); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
//   if (result.parsed == undefined)
//     // .env 파일 parsing 성공 여부 확인
//     throw new Error("Cannot loaded environment variables file."); // parsing 실패 시 Throwing
// })();

// if (typeof process.env.PUBLIC_URL === "undefined") {
//   throw new Error("PUBLIC_URL is not defined in the environment variables.");
// }

if (typeof process.env.SECRET_KEY === "undefined") {
  throw new Error("SECRET_KEY is not defined in the environment variables.");
}

const secretKey = process.env.SECRET_KEY;

//accessToken Issuing
const generateAccessToken = (role: string) => {
  if (secretKey == undefined) {
    throw new Error("secretKey is Unloaded");
  }
  console.log(secretKey);
  const payload = { username: role };
  const token = jwt.sign(payload, secretKey, { expiresIn: "1m" });

  return token;
};

const refreshToken = (userRole: string, receivedToken: string) => {
  try {
    if (secretKey == undefined) {
      throw new Error("secretKey is Unloaded");
    }
    const decoding = jwt.verify(receivedToken, secretKey);
    console.log(decoding);
    const payload = { username: userRole };
    const newToken = jwt.sign(payload, secretKey, { expiresIn: "1m" });
    return newToken;
  } catch (error) {
    throw new Error("Invalid Token Accepted. Verify your Token");
  }
};
router.get(
  "/:role/refreshing",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (secretKey == undefined) {
        throw new Error("secretKey is Unloaded");
      }
      const userRole = req.params.role as string;
      const receivedToken = req.headers["token"] as string;
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
      const receivedToken = req.headers["token"] as string;
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
      const receivedToken = generateAccessToken(userRole);
      res.status(200).json({
        token: receivedToken,
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
