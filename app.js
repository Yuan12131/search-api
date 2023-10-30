const express = require('express');
const app = express();
const fs = require('fs');

const port = 8080; // 사용할 포트 번호


// 정적 파일을 제공하기 위한 미들웨어 설정
app.use(express.static('public'));
