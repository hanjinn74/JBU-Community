const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  try {
    // 1. 헤더에서 토큰 꺼내기
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // 2. 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. 요청 객체에 정보 담기
    req.token = token;
    req.user = decoded.user; // (여기서 user ID가 들어감)
    
    next(); // 통과!

  } catch (error) {
    console.error("Auth Middleware Error:", error.message); // 서버 터미널에만 에러 출력
    res.status(401).send('인증이 필요합니다.');
  }
};

module.exports = auth;