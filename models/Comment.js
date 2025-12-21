const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  // 1. 댓글 내용
  content: {
    type: String,
    required: [true, '댓글 내용을 입력해주세요.']
  },
  
  // 2. 작성자 정보 (User 모델 참조)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // 3. 게시글 정보 (동적 참조)
  // post: 게시글의 _id
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'postModel' // postModel 필드에 적힌 모델 이름을 참조하겠다!
  },
  // postModel: 게시글의 종류 ('CarpoolPost', 'MeetingPost', 'SportsPost')
  postModel: {
    type: String,
    required: true,
    enum: ['CarpoolPost', 'MeetingPost', 'SportsPost']
  }

}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;