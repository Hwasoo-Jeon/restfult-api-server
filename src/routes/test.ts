import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

/* get method */
router.get(
  "/get/username",
  (req: Request, res: Response, next: NextFunction) => {
    let username = req.query.username; //http://localhost:3000/test?username=test => queryString 방식으로 값 접근 가능

    if (username == null || username.length === 0) {
      res.send(
        JSON.stringify({
          //json 데이터를 string하여 body로 보냄
          code: 400,
          message: "missing parameter",
        })
      );

      return;
    }

    res.send(
      JSON.stringify({
        code: 200,
        yourname: username,
      })
    );
  }
);

/* post method */
router.post(
  "/post/register",
  (req: Request, res: Response, next: NextFunction) => {
    let username = req.body.username;

    if (username === null || username.length === 0) {
      res.send(
        JSON.stringify({
          code: "400",
          message: "not registered",
        })
      );
      return;
    }

    res.send(
      JSON.stringify({
        code: 200,
        yourname: username,
      })
    );
  }
);

//응답 헤더 및 CORS 설정
router.get(
  "/get/customheader",
  (req: Request, res: Response, next: NextFunction) => {
    //응답 코드설정
    res.writeHead(200, {
      "content-type": "application/json", //응답 본문 JSON 형식
      "Access-Control-Allow-Origin": "*", //모든 도메인으로 부터 요청 허용
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE", //http 메서드 허용 범위
      "Access-Control-Max-Age": "3600", //헤더를 통해 이 정보를 얼마나 오랫동안 캐시할지, 일한 요청을 반복해서 보낼 때 매번 사전 요청을 보내지 않아도 되게 하여 통신 효율을 높임,사전 요청 결과가 캐시될 수 있는 최대 시간(초 단위)
      "Access-Control-Allow-Headers": "x-requested-with", //클라이언트에서 AJAX로 보내면 이 헤더 보냄,서버가 허용하는 특정 요청 헤더
    });

    res.end('{"code":200, "result": "ok"}');
  }
);

export default router;
