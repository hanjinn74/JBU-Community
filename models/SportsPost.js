const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sportsPostSchema = new Schema({
  // 1. 작성자 정보
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 2. 스포츠 매칭 정보
  title: {
    type: String,
    required: [true, '제목을 입력해주세요.']
  },
  content: {
    type: String,
    required: [true, '내용을 입력해주세요.']
  },
  sportType: {
    type: String,
    required: [true, '종목을 선택해주세요.'],
    enum: ['축구', '농구', '풋살', '배드민턴', '테니스', '탁구', '족구', '기타'] // 주요 종목
  },
  headcount: {
    type: Number,
    required: [true, '모집 인원을 입력해주세요.'],
    min: 1
  },
  date: {
    type: Date,
    required: [true, '경기 날짜와 시간을 입력해주세요.']
  },
  location: {
    type: String,
    required: [true, '장소를 입력해주세요.'] // 예: 대운동장, 체육관
  },
  openChatLink: {
    type: String,
    required: [true, '연락처나 오픈채팅방 링크를 입력해주세요.']
  }

}, { timestamps: true });

const SportsPost = mongoose.model('SportsPost', sportsPostSchema);
module.exports = SportsPost;