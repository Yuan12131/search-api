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

app.get('/search/news', (req, res) => {
  const query = req.query.query;
  const api_url = `https://openapi.naver.com/v1/search/news?query=${encodeURI(query)}`;

  const options = {
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret
    }
  };

  http.get(api_url, options, response => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
      res.end(data);
    });
  });
});

app.listen(port, function () {
  console.log(`http://127.0.0.1:${port}`);
});