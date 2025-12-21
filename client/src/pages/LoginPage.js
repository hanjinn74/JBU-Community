import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/users/login', formData);
      
      // 1. (수정) 토큰과 함께 'nickname'도 꺼내기
      const { token, nickname } = response.data;

      // 2. (수정) 토큰과 닉네임 모두 저장!
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('nickname', nickname); // 닉네임 저장

      alert(`환영합니다, ${nickname}님!`); // 환영 메시지에 닉네임 넣기
      
      navigate('/');
      window.location.reload(); 

    } catch (error) {
      console.error("로그인 실패:", error);
      if (error.response && error.response.data) {
        alert(error.response.data); 
      } else {
        alert('로그인 중 오류가 발생했습니다.');
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
          로그인
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인하기
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;