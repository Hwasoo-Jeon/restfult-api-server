import crypto from "crypto";
import fileSystem from "fs";

(() => {
  fileSystem.unlink(".env", (err) => {
    //callback 인자는 error
    if (err === null) {
      console.log("success");
    } else {
      console.log("fail");
    }
  });
  fileSystem.writeFile(".env", "", function (err) {
    if (err === null) {
      console.log("success");
    } else {
      console.log("fail");
    }
  });
  fileSystem.appendFileSync(
    ".env",
    `PUBLIC_URL=http://localhost:3000\nREDIS_PASSWORD=root\nREDIS_PORT=6379\nREDIS_LISTENING_PORT=3005\nNODE_ENV=development\n`,
    "utf8"
  );
})();

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

(() => {
  const secretKey = crypto
    .createHash("sha256")
    .update("MyUniqueValueForCookie")
    .digest("hex");

  const env = `COOKIE_SECRET=${secretKey}\n`;
  fileSystem.appendFileSync(".env", env, "utf8");
})();
