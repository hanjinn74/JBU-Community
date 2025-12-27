const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const VerificationCode = require('../models/VerificationCode');
const User = require('../models/User'); // 이미 가입된 이메일인지 확인용

require('dotenv').config();

// 이메일 전송 도구 설정 (Transporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD
  }
});

// --- [창구 1: 인증번호 전송] ---
// POST /api/auth/send-code
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. 도메인 체크 (중부대 메일만 허용)
    // if (!email.endsWith('@jmail.ac.kr')) {
    //   return res.status(400).send('중부대학교 웹메일(@jmail.ac.kr)만 가능합니다.');
    // }

    // 2. 이미 가입된 이메일인지 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('이미 가입된 이메일입니다.');
    }

    // 3. 인증번호 생성 (6자리 숫자)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. 기존에 보낸 인증번호가 있다면 삭제 (새로 보내니까)
    await VerificationCode.deleteMany({ email });

    // 5. DB에 저장 (5분 뒤 자동 삭제됨)
    await new VerificationCode({ email, code }).save();

    // 6. 이메일 발송
    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: email,
      subject: '[JBU-Community] 회원가입 인증번호입니다.',
      text: `인증번호는 [${code}] 입니다. 3분 안에 입력해주세요.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send('인증번호가 발송되었습니다. 메일함을 확인해주세요!');

  } catch (error) {
    console.error(error);
    res.status(500).send('메일 발송 실패: ' + error.message);
  }
});

// --- [창구 2: 인증번호 확인] ---
// POST /api/auth/verify-code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await VerificationCode.findOne({ email, code });

    if (!record) {
      return res.status(400).send('인증번호가 일치하지 않거나 만료되었습니다.');
    }

    // 인증 성공 시 DB에서 해당 번호 삭제 (재사용 방지)
    await VerificationCode.deleteOne({ _id: record._id });

    res.status(200).send('인증되었습니다!');

  } catch (error) {
    res.status(500).send('인증 확인 중 오류 발생');
  }
});

module.exports = router;