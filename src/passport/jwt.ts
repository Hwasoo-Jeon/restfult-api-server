import { PassportStatic } from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import { user } from "../model/user";
/*
Passport Node.js에서 인증적용을 위한 라이브러리
클라이언트가 서버에 권한을 요청을 할 자격이 있는지 인증(검증)할 때에 "passport" 미들웨어를 사용
Strategy는 Passport Middleware에서 사용하는 인증 전략

흐름 : 인증 => 인증된 사용자의 정보를 담아 라우터에 req
*/

// Request의 cookie 추출
function cookieExtractor(req: any) {
  let token = null;
  if (req && req.cookies) token = req.cookies.accessToken;
  return token;
}

// Passport를 사용하여 JWT를 통한 인증 전략
// 공식문서 참조
export default (passport: PassportStatic) => {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.SECRET_KEY as string,
  };
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      const username = payload.username;
      try {
        const userInfo = await user.findOne({ username });

        if (userInfo) return done(null, userInfo);
        done(null, false);
      } catch (err) {
        done(err, false);
      }
    })
  );
};
