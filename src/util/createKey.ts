import crypto from "crypto";
import fileSystem from "fs";

/*
secretkey는 서버의 환경변수에 설정
충분한 길이와 복잡성, 임의성을 가지고 생성 => 로테이션되면 인증 못하니 안돼.
초기 개발환경에서 node src/js/createKey.js 실행.
*/

(() => {
  const secretKey = crypto
    .createHash("sha256")
    .update("MyUniqueValue")
    .digest("hex");

  const env = `SECRET_KEY=${secretKey}\n`;
  fileSystem.appendFileSync(".env", env, "utf8");
})();
