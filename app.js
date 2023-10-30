const express = require('express');
const app = express();
const fs = require('fs');

var client_id = '9e_Z7STmxYIcQkv6gSSD';
var client_secret = 'WFiNunUoAn';

const port = 8080; // 사용할 포트 번호


// 정적 파일을 제공하기 위한 미들웨어 설정
app.use(express.static('public'));

// 루트 경로로 접근시 index.html 파일 전송
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// CSS 파일 요청에 대한 응답
app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/public/style.css');
});

// JavaScript 파일 요청에 대한 응답
app.get('/script.js', (req, res) => {
  res.sendFile(__dirname + '/public/script.js');
});

// '/search/news' 경로로 GET 요청
app.get('/search/news', (req, res) => {
  // 검색어를 URL 인코딩하여 API 요청 URL을 생성
  var api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(req.query.query);

  // 'request' 모듈을 사용하여 외부 API에 HTTP GET 요청 전달
  var request = require('request');
  var options = {
      url: api_url,
      // 네이버 API 요청 시 필요한 클라이언트 ID와 클라이언트 시크릿을 요청 헤더에 추가
      headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
   };

  // API 요청을 보내고 응답을 처리하는 비동기 함수
  request.get(options, (error, response, body) => {
    // 에러 없이 요청이 완료되고 응답 상태 코드가 200(OK)인 경우에 실행
    if (!error && response.statusCode == 200) {
      // 응답 헤더를 설정하여 JSON 형식의 컨텐츠를 UTF-8 문자 인코딩으로 반환
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(body); // API 응답
    } else {
      res.status(response.statusCode).end(); // 에러 발생 시 응답 상태 코드를 반환하고 요청 종료
      console.log('error = ' + response.statusCode); // 에러 상태 코드를 콘솔 출력
    }
  });
});


// 404 오류 페이지 설정
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버 가동중 -> http://localhost:${port}/`);
});
