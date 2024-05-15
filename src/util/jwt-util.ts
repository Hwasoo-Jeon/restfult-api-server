import jwt from "jsonwebtoken";
import roleDataJson from "../role.json";

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

const roleData: RoleData = roleDataJson; // !!!!!!!!!수정하고, 바로 밑 함수 수정
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

export { getPermissionsForRole, generateAccessToken, refreshToken, secretKey };
