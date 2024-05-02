import express, { Request, Response } from "express";
import cookieParser from "cookie-parser"; //cookie-parser 미들웨어를 불러옵니다. 이는 요청된 쿠키를 파싱하여 req.cookies로 접근하게 함.
import logger from "morgan"; //morgan 미들웨어를 불러옵니다. HTTP 요청 로거로서, 요청에 대한 정보를 로그로 기록하는 데 사용
// import { fileURLToPath } from "url";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import testRouter from "./routes/test";
import tokenRouter from "./routes/token";

import dotenv from "dotenv";
import path from "path"; //파일 및 디렉토리 경로 작업 용도

// 일회성 변수가 전역적으로 남는 것을 방지하기 위해 익명함수로 스코프를 제한함
(() => {
  const result = dotenv.config({ path: path.join(__dirname, "..", ".env") }); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
  if (result.parsed == undefined)
    // .env 파일 parsing 성공 여부 확인
    throw new Error("Cannot loaded environment variables file."); // parsing 실패 시 Throwing
})();

const app = express();

//logger 설정
logger.token("date", function (req: Request, res: Response) {
  return new Date().toLocaleString();
});

logger.token("access", function (req: Request, res: Response) {
  return req.ip;
});

logger.format(
  "myformat",
  "[ :date ] :access :method :url :status :response-time ms"
);

app.use(logger("myformat")); //HTTP 요청 로그를 개발자 친화적 형식으로 출력
app.use(express.json()); //들어오는 요청 본문(body)을 JSON 형식으로 파싱
app.use(express.urlencoded({ extended: true })); //URL 인코딩된 데이터를 파싱합니다. extended: false는 라이브러리 querystring을 사용함(ex form 태그)
app.use(cookieParser()); //요청된 쿠키를 파싱
app.use(express.static(path.join(__dirname, "public"))); //정적 파일을 제공하기 위한 경로를 설정합니다. 여기서 __dirname은 현재 실행 중인 스크립트가 위치한 디렉토리의 절대 경로
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views")); // view 파일들이 모여있는 폴더 지정

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/test", testRouter);
app.use("/token", tokenRouter);

export default app;
