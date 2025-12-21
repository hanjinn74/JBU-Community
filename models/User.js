const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// 2. 'User' 설계도 정의
const userSchema = new Schema({
  
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요.'],
    unique: true, 
    lowercase: true,
    match: [/\S+@\S+\.\S+/, '이메일 형식이 올바르지 않습니다.'] 
  },
  
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요.'],
  },

  // 1. (NEW!) 닉네임 필드 추가
  nickname: {
    type: String,
    required: [true, '닉네임을 입력해주세요.'], // 필수 입력
    unique: true, // 중복 금지
    maxlength: [10, '닉네임은 10글자 이내로 설정해주세요.'] // 길이 제한
  }

}, { timestamps: true });


// 3. 비밀번호 암호화 미들웨어
userSchema.pre('save', async function(next) {
  // (NEW!) 비밀번호가 변경될 때만 암호화 실행 (닉네임만 바꿀 때는 실행 안 함)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;