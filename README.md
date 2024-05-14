# NodeJS Restful API 서버
<br/>

## 목적
- NodeJS+Express 환경에서의 Restful API 서버 구현
- Typescript 설정 및 활용
- JWT 설정 및 활용
<br/>

## 환경
- BackEnd : NodeJS + Express Generator, JWT, Typescript
- FrontEnd : ejs(간단한 요청용 view)
- DB : Redis
<br/>

## 흐름
- 로그인 정보를 검증 : Passport.js
- 사용자 인증 정보를 전송 수단 : JWT
- 세션 정보를 저장 : Redis
<br/>

## 기능
- Accesstoken, RefreshToken 발급 및 저장(Cookie), 검증, 갱신, 삭제
- 로그인 기능(Passport JS)
<br/>

## 진행중
- cookie-parser로 쿠키 설정
- passport를 사용한 login 및 token 처리
- Redis를 통한 refreshToken 저장
- 사용자별 권한 제한
<br/>

## 참고사항
- AccessToken의 보관 위치? Cookie or ModernStorage => https://velog.io/@0307kwon/JWT%EB%8A%94-%EC%96%B4%EB%94%94%EC%97%90-%EC%A0%80%EC%9E%A5%ED%95%B4%EC%95%BC%ED%95%A0%EA%B9%8C-localStorage-vs-cookie
<br/>

## 학습사항
- expressGenerator를 이용하여 router 환경 구성
- TypeScript를 설정 및 활용
- passport를 사용한 login
- AccessToken과 RefreshToken 활용 구분
