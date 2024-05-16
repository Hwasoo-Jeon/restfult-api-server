import express, { NextFunction, Response, Request } from "express";
import secure from "../middlewares/secure";
const router = express.Router();

/* GET home page. */
router.get(
  "/",
  secure.csrfProtection,
  (req: Request, res: Response, next: NextFunction) => {
    // 환경 변수를 사용하여 SUBMIT_URL 설정
    const { PUBLIC_URL } = process.env;
    console.log(PUBLIC_URL);
    res.render("index.ejs", {
      name: "방문자",
      PUBLIC_URL: `${PUBLIC_URL}`,
      TOKEN_URL: `${PUBLIC_URL}/token`,
      CHECK_URL: `check`,
      ISSUE_URL: `issuing`,
      VERIFY_URL: `verification`,
      REFRESH_URL: `refreshing`,
      REMOVE_URL: `removing`,
      LOGIN_URL: `auth/login`,
      SIGNUP_URL: `auth/signup`,
      csrfToken: req.csrfToken(),
    });
  }
);

export default router;
