import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '' 
  });

  // 이메일 인증 관련 상태들
  const [verificationCode, setVerificationCode] = useState(''); // 입력한 인증번호
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호가 발송되었는지
  const [isVerified, setIsVerified] = useState(false); // 인증이 완료되었는지

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 인증번호 전송 함수
  const handleSendCode = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    // [수정] 도메인 체크 활성화 (주석 해제)
    // 입력한 이메일이 @jmail.ac.kr 로 끝나지 않으면 경고를 띄우고 중단합니다.
    if (!formData.email.endsWith('@jmail.ac.kr')) {
      alert('중부대학교 웹메일(@jmail.ac.kr)로만 인증 및 가입이 가능합니다.');
      return;
    }

    try {
      await axios.post('/api/auth/send-code', { email: formData.email });
      setIsCodeSent(true);
      alert('인증번호가 메일로 발송되었습니다! (3분 내 입력)');
    } catch (error) {
      console.error(error);
      alert(error.response?.data || '메일 발송 실패');
    }
  };

  // 인증번호 확인 함수
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      await axios.post('/api/auth/verify-code', {
        email: formData.email,
        code: verificationCode
      });
      setIsVerified(true); // 인증 성공!
      alert('이메일 인증이 완료되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error.response?.data || '인증 실패');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // 인증 완료 여부 체크
    if (!isVerified) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    if (!formData.email || !formData.password || !formData.nickname) {
      alert('모든 칸을 입력해주세요.');
      return;
    }

    try {
      await axios.post('/api/users/register', formData);
      alert('회원가입에 성공했습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');

    } catch (error) {
      console.error("회원가입 실패:", error);
      if (error.response && error.response.data) {
        alert(error.response.data); 
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          
          {/* 이메일 입력 + 전송 버튼 */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              id="email"
              label="학교 이메일 (@jmail.ac.kr)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={isVerified} // 인증 완료되면 수정 불가
              helperText="중부대학교 웹메일(@jmail.ac.kr)을 입력해주세요."
            />
            <Button 
              variant="contained" 
              sx={{ mt: 2, height: '56px', whiteSpace: 'nowrap' }}
              onClick={handleSendCode}
              disabled={isVerified}
            >
              {isCodeSent ? '재전송' : '인증번호 전송'}
            </Button>
          </Box>

          {/* 인증번호 입력칸 (전송 버튼 누르면 나타남) */}
          {isCodeSent && !isVerified && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="인증번호 6자리"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button variant="outlined" onClick={handleVerifyCode}>
                확인
              </Button>
            </Box>
          )}

          {/* 인증 성공 메시지 */}
          {isVerified && (
            <Alert severity="success" sx={{ mt: 1 }}>
              이메일 인증이 완료되었습니다.
            </Alert>
          )}
          
          <TextField
            fullWidth
            id="password"
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            id="nickname"
            label="닉네임 (10글자 이내)"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 10 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isVerified} // 인증 안 되면 가입 버튼 비활성화
          >
            가입하기
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;