const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingPostSchema = new Schema({
  // 1. 작성자 정보 (필수)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 2. 과팅 매칭 정보
  title: {
    type: String,
    required: [true, '제목을 입력해주세요.']
  },
  content: {
    type: String,
    required: [true, '내용을 입력해주세요.']
  },
  campus: {
    type: String,
    required: [true, '캠퍼스를 선택해주세요.'],
    enum: ['고양', '충청'] // 이 두 값 중 하나만 들어올 수 있음
  },
  gender: {
    type: String,
    required: [true, '성별을 선택해주세요.'],
    enum: ['남성', '여성']
  },
  headcount: {
    type: Number,
    required: [true, '인원수를 입력해주세요.'],
    min: 1,
    max: 10
  },
  openChatLink: {
    type: String,
    required: [true, '오픈채팅방 링크를 입력해주세요.'] // 소통 창구
  }

}, { timestamps: true });

const MeetingPost = mongoose.model('MeetingPost', meetingPostSchema);
module.exports = MeetingPost;