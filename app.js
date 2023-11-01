const express = require('express');
const app = express();
const fs = require('fs');
const http = require('https'); // https 모듈 추가

const client_id = '9e_Z7STmxYIcQkv6gSSD';
const client_secret = 'WFiNunUoAn';

const port = 8080; // 사용할 포트 번호

// 정적 파일을 제공하기 위한 미들웨어 설정
app.use(express.static('public'));

// 루트 경로로 접근시 index.html 파일 전송
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// /search/news 엔드포인트로 들어오면 실행되는 라우팅 핸들러 -> GET 요청 처리
app.get('/search/news', (req, res) => {
  // 검색어를 입력한 내용 -> 요청의 쿼리 매개변수에서 'query' 값
  const query = req.query.query;
  // 네이버 뉴스 API의 엔드포인트 URL을 생성
  // encodeURI() 함수를 사용하여 검색어에 포함된 특수 문자나 공백 등을 안전하게 인코딩 -> 검색어를 URL에서 사용 가능한 형태로 인코딩
  const api_url = `https://openapi.naver.com/v1/search/news?query=${encodeURI(query)}`;

  // API 요청에 필요한 옵션을 설정
  const options = {
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret
    }
  };

  // http.get 함수를 사용하여 네이버 API에 GET 요청 -> 지정된 URL로 요청을 보내고, 서버에서 응답이 오면 response 객체를 사용하여 응답을 처리
  http.get(api_url, options, response => {
    let data = '';

    // API에서 전달한 응답 데이터를 조각조각 도착할 때마다 data 변수에 추가
    response.on('data', chunk => {
      data += chunk;
    });

    // API 응답을 모두 받은 후(모든 데이터 수신)에는 클라이언트에게 상태 코드 200과 함께 JSON 형식의 응답을 전송 
    // res.writeHead() 함수로 응답 헤더를 설정하고, res.end() 함수로 JSON 형식의 실제 응답 데이터 (검색 결과)를 클라이언트에게 전송
    response.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(data);
    });
  });
});
// 이 코드는 클라이언트로부터 검색어를 받아 네이버 뉴스 API에 요청을 보내고, API 응답을 클라이언트에게 전달하는 서버 엔드포인트를 정의
// -> 이를 통해 클라이언트는 서버를 통해 안전하게 API를 사용할 수 있고, CORS 문제도 피할 수 있음

app.listen(port, function () {
  console.log(`http://127.0.0.1:${port}`);
});