import dotenv from "dotenv";
import path from "path"; //파일 및 디렉토리 경로 작업 용도

// 일회성 변수가 전역적으로 남는 것을 방지하기 위해 익명함수로 스코프를 제한함
(() => {
  const result = dotenv.config({ path: path.join(__dirname, "..", ".env") }); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
  if (result.parsed == undefined)
    // .env 파일 parsing 성공 여부 확인
    throw new Error("Cannot loaded environment variables file."); // parsing 실패 시 Throwing
})();
