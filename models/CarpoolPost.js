//DB에 카풀 게시글을 어떤 형식으로 저장할 지 몽구스로 설계로 만들어보자
// ex) starPoint: String, endPoint: String, departureTime: Data

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 얘가 설계도 느낌

//설계도 정의
const CarpoolSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, //user unique id save
        ref: 'User', // user 모델 참조용
        required: true 
        
    },

    StartPoint: {       //출발지
        type: String,   // 문자열 형식 ex) 고양캠, 충청캠
        required: true // 필수 항목임(빈칸 시 error)
    },
    EndPoint: {        //도착지겠죠?
        type: String,    
        required: true
    },
    DepartureTime: {
        type: Date,   //출발 날짜, 시간
        required: true
    },


//추후 작성자 정보도 연결 ex)
/* author {
    type: Schema.Types.ObjectId,
    ref: 'User'// 'User' 모델과 연결
    // } */
}, { timestamps: true});  // 생성, 수정 시간을 자동 기록

//데이터 로봇(model)을 만들어 볼거에요~
// 몽구스 씨에게 CarpoolPost 라는 이름의 로봇을 만들라 명령(설계도는 CarpoolSchema 사용)
const CarpoolPost = mongoose.model ('CarpoolPost', CarpoolSchema);

// 다른 파일에서 카풀포스트 로봇 사용 가능하게 (export)함
module.exports =CarpoolPost;