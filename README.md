# NodeJS Restful API 서버
<br/>

## 목적
- NodeJS+Express 환경에서의 Restful API 서버 구현
- Typescript 설정 및 활용
- JWT 설정 및 활용
<br/>

## 환경 및 사용 라이브러리
- Language : TypeScript
- BackEnd : NodeJS + Express Generator, JWT
- FrontEnd : ejs(view)
- DB : Redis, MongoDB
- Library : csurf(csrf), mongoose(mongodb 영속성 생성), passport(jwt 인증), joi(클라이언트의 입력값 검증) 등
<br/>

## 흐름
- 회원 가입 정보 : mongodb 저장
- 로그인 결과 : accessToken, refreshToken의 csrf를 통한 cookie 저장, refreshToken의 redis 저장
- API 요청에 따른 JWT 인증 검증 : Passport.js
<br/>

## 기능
- Accesstoken, RefreshToken 발급 및 저장(Cookie), 검증, 갱신, 삭제
- token 검증(Passport JS)
<br/>

## 진행중
- 기능 검토
- 사용자별 권한 제한
<br/>

## 기타 사항
- AccessToken의 보관 위치? Cookie or ModernStorage => https://velog.io/@0307kwon/JWT%EB%8A%94-%EC%96%B4%EB%94%94%EC%97%90-%EC%A0%80%EC%9E%A5%ED%95%B4%EC%95%BC%ED%95%A0%EA%B9%8C-localStorage-vs-cookie
<br/>

## 학습사항
- expressGenerator를 이용하여 router 환경 구성
- TypeScript를 설정 및 활용
- passport를 사용한 login
- AccessToken과 RefreshToken 활용 구분
- Restful하다?
  - 리소스 기반의 URL 설계(/users)
  - HTTP 메소드를 활용한 리소스 연산(CRUD)
  - Stateless 통신(JWT)
  - 표준화된 콘텐츠 타입을 사용(JSON, XML)
- Redis 사용 이유?
  - 배경 : RDB에 데이터를 저장 후 직접 쿼리하여 사용자에게 제공하는 방식=> 매 요청마다 쿼리 진행. 타 API에 비해 많이 호출되는 데이터들은 캐시하는 것이 유리
  - 요약 : REDIS(REmote Dictionary Server)는 메모리 기반의 “키-값” 구조 데이터 관리 시스템이며, 모든 데이터를 메모리에 저장하고 조회하기에 빠른 Read, Write 속도를 보장하는 비 관계형 데이터베이스
  - type : String, Lists, Sets, Sorted sets, Hashs
  - 장점
    - 리스트, 배열과 같은 데이터를 처리하는데 유용
    - 리스트형 데이터 입력과 삭제가 MySql에 비해 10배정도 빠름
  - 단점
    - 메모리 파편화>>> 메모리를 2배사용, 싱글스레드로 스냅샷 만들 때 자식 프로세스로 분할되어 새로 변경된 메모리 페이지 복사 후 사용(Copy on Write), 그래서 필요 메모리보다 실제로 더 많은 메모리 사용
    - 데이터 휘발성>>> 장애 발생 시, 스냅샷을 이용하여 적절히 복구 필요
  - 결론 : RDB의 데이터를 빠르게 응답하기 위한 캐시로 사용
