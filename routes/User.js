const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- [창구 1: 회원가입 API] ---
router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // (NEW!) 백엔드에서도 도메인 체크
    if (!email.endsWith('@jmail.ac.kr')) {
       return res.status(400).send('학교 이메일(@jmail.ac.kr)만 사용 가능합니다.');
    }

    // 3. (NEW!) 닉네임 중복 검사
    const existingNickname = await User.findOne({ nickname });
    if (existingNickname) {
      return res.status(400).send('이미 사용 중인 닉네임입니다.');
    }

    // 4. (수정) 닉네임 포함해서 User 생성
    const newUser = new User({
      email,
      password,
      nickname
    });

    await newUser.save();
    res.status(201).send('회원가입에 성공했습니다.');

  } catch (error) {
    res.status(500).send('회원가입 실패: ' + error.message);
  }
});

// --- [창구 2: 로그인 API] ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // 5. (NEW!) 토큰과 함께 '닉네임'도 보내주기 (프론트엔드 환영 메시지용)
        res.status(200).json({ 
          token, 
          nickname: user.nickname 
        });
      }
    );

  } catch (error) {
    res.status(500).send('로그인 실패: ' + error.message);
  }
});

module.exports = router;