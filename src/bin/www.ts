#!/usr/bin/env node

/* js 바인딩 */
import app from "../app";
import debug from "debug";
import http from "http";
// import dotenv from "dotenv";
// import path from "path"; //파일 및 디렉토리 경로 작업 용도

// // 일회성 변수가 전역적으로 남는 것을 방지하기 위해 익명함수로 스코프를 제한함
// (() => {
//   const result = dotenv.config(); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
//   if (result.error) {
//     throw result.error;
//   }
// })();

const debugLog = debug("apiserver:server");

/* port 변경 */
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/* http 서버 생성 */
const server = http.createServer(app);

/* port에서 리스닝을 시작 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/* 포트 정규화 함수 : 숫자 or 문자열 반환. 그 외 false */
function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/* 오류 이벤트 리스너 
 EACCES: 포트 접근 권한 없음
 EADDRINUSE : 이미 사용 중인 포트
 Pipe는 프로세스 간 통신(IPC) : 부모 프로세스에서 자식 프로세스로 데이터 전달 시 사용(단방향)
 Named Pipe : 파이프의 확장된 형태, 이름을 가지고 있어 파일 시스템 내에서 찾을 수 있다. 그래서 관련없는 프로세스에서도 데이터 접근 가능(양방향)
 포트 : 특정 ip 주소 내에서 프로세스 식별
*/
function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  if (addr === null) {
    debug("Server is not run");
    return;
  }
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
