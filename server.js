require('dotenv').config();

//필수 도구들(import)
const express = require('express'); 
const mongoose = require('mongoose'); //몽구스 통역기
const carpoolRoutes = require('./routes/Carpool');
const userRoutes = require('./routes/User');
const meetingRoutes = require('./routes/Meeting');
const sportsRoutes = require('./routes/Sports');
const commentRoutes = require('./routes/Comment');
//const carpoolRoutes = require('./routes/Carpool'); //카풀 부서 불러오기(routes/Carpool.js)
//왜 얘를 못 찾지

const dbURI = process.env.MONGO_URI; 
//Express 서버 생성 및 설정
const app = express();
const port = 5000; // 리택트 기본 포트 3000과 겹치지 않게
//*JSON 번역(파싱)기 장착
app.use(express.json());

//MongoDB Atlas 연결 <password> C1.txt


mongoose.connect(dbURI)
    .then(() => {  //DB 연결 성공 시 {} 코드 실행, result 는 안쓰니까 없애놈
        console.log('DB 연결 성공');

        app.listen(port, () => {
            console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
        });
        })
        .catch((err) => {
        console.log('DB 연결 실패', err);
       });

//기본 GET 라우트를 설정해줌. 그리고 local 5000에서 접속 실행 
app.get('/', (req, res) => {
    res.send(" Mern 스택 서버 실행 성공")
});

app.use('/api/Carpool', carpoolRoutes)
// 과팅 부서가 생기면?
// const meetingRoutes = require('./routes/meetings');
// app.use('/api/meetings, meetingRoutes);

// 2. (NEW!) '회원 관리 부서' 연결
// " /api/users 로 시작하는 모든 요청은,
//   'userRoutes'('routes/User.js' 파일)가 처리하게 해!"
app.use('/api/users', userRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/comments', commentRoutes);