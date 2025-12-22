import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

function RegisterPage() {
  const navigate = useNavigate();

  // 1. (수정) 'nickname' 상태 추가
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '' 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.email.endsWith('@jmail.ac.kr')) {
      alert("중부대학교 웹메일로만 가입할 수 있습니다.");
      return;
    }

    // 2. (수정) 닉네임도 유효성 검사
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
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          
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

          {/* 3. (NEW!) 닉네임 입력창 추가 */}
          <TextField
            fullWidth
            id="nickname"
            label="닉네임 (10글자 이내)"
            name="nickname" // 백엔드와 이름 일치해야 함
            value={formData.nickname}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 10 }} // 최대 길이 제한
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            가입하기
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;