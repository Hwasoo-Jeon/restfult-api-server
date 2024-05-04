import express, { NextFunction, Response, Request } from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  // 환경 변수를 사용하여 SUBMIT_URL 설정
  const { PUBLIC_URL } = process.env;
  console.log(PUBLIC_URL);
  res.render("index.ejs", {
    name: "방문자",
    TOKEN_URL: `${PUBLIC_URL}/token`,
    CHECK_URL: `check`,
    ISSUE_URL: `issuing`,
    VERIFY_URL: `verification`,
    REFRESH_URL: `refreshing`,
    REMOVE_URL: `removing`,
  });
});

router.post("/urlbody", (req, res, next) => {
  // 비구조화 할당
  const { key1 } = req.body;
  console.log(JSON.stringify(req.body));
  res.send(
    JSON.stringify({
      code: 200,
      result: key1,
    })
  );
});

export default router;
