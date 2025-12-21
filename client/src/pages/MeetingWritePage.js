import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem'; // (NEW!) 선택창(Dropdown) 메뉴

function MeetingWritePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    campus: '고양', // 기본값
    gender: '남성', // 기본값
    headcount: 2,
    openChatLink: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      
      await axios.post(
        '/api/meeting', 
        formData, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('과팅 글이 성공적으로 등록되었습니다.');
      navigate('/meeting'); // 과팅 목록으로 이동

    } catch (error) {
      console.error("글 등록 실패:", error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('글 등록에 실패했습니다.');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        💖 과팅 글 쓰기
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
        
        {/* 제목 */}
        <TextField
          fullWidth label="제목" name="title"
          value={formData.title} onChange={handleChange}
          margin="normal" required
        />

        {/* 캠퍼스 선택 (Select) */}
        <TextField
          select fullWidth label="캠퍼스" name="campus"
          value={formData.campus} onChange={handleChange}
          margin="normal" required
        >
          <MenuItem value="고양">고양캠퍼스</MenuItem>
          <MenuItem value="충청">충청캠퍼스</MenuItem>
        </TextField>

        {/* 성별 선택 (Select) */}
        <TextField
          select fullWidth label="작성자 성별" name="gender"
          value={formData.gender} onChange={handleChange}
          margin="normal" required
        >
          <MenuItem value="남성">남성</MenuItem>
          <MenuItem value="여성">여성</MenuItem>
        </TextField>

        {/* 인원수 */}
        <TextField
          fullWidth label="인원수 (명)" name="headcount" type="number"
          value={formData.headcount} onChange={handleChange}
          margin="normal" required
          inputProps={{ min: 1, max: 10 }}
        />

        {/* 내용 */}
        <TextField
          fullWidth label="내용 / 자기소개" name="content"
          value={formData.content} onChange={handleChange}
          margin="normal" required multiline rows={4}
        />

        {/* 오픈채팅 링크 */}
        <TextField
          fullWidth label="오픈채팅방 링크" name="openChatLink"
          value={formData.openChatLink} onChange={handleChange}
          margin="normal" required
          placeholder="https://open.kakao.com/..."
        />

        <Button
          type="submit" fullWidth variant="contained" color="secondary"
          size="large" sx={{ mt: 3 }}
        >
          등록하기
        </Button>
      </Box>
    </Box>
  );
}

export default MeetingWritePage;