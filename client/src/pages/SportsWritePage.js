import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

function SportsWritePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sportType: '축구', // 기본값
    headcount: 1,
    date: '',
    location: '',
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
        '/api/sports', 
        formData, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('스포츠 매칭 글이 등록되었습니다.');
      navigate('/sports');

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
        ⚽ 스포츠 매칭 글쓰기
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
        
        <TextField
          fullWidth label="제목" name="title"
          value={formData.title} onChange={handleChange}
          margin="normal" required
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <TextField
            select fullWidth label="종목" name="sportType"
            value={formData.sportType} onChange={handleChange}
            margin="normal" required
          >
            {['축구', '농구', '풋살', '배드민턴', '테니스', '탁구', '족구', '기타'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth label="모집 인원 (명)" name="headcount" type="number"
            value={formData.headcount} onChange={handleChange}
            margin="normal" required inputProps={{ min: 1 }}
          />
        </div>

        <TextField
          fullWidth label="경기 일시" name="date" type="datetime-local"
          value={formData.date} onChange={handleChange}
          margin="normal" required InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth label="장소 (예: 대운동장)" name="location"
          value={formData.location} onChange={handleChange}
          margin="normal" required
        />

        <TextField
          fullWidth label="내용" name="content"
          value={formData.content} onChange={handleChange}
          margin="normal" required multiline rows={4}
          placeholder="경기 방식, 실력 등 자세한 내용을 적어주세요."
        />

        <TextField
          fullWidth label="연락처 / 오픈채팅방 링크" name="openChatLink"
          value={formData.openChatLink} onChange={handleChange}
          margin="normal" required
        />

        <Button
          type="submit" fullWidth variant="contained" color="success"
          size="large" sx={{ mt: 3 }}
        >
          등록하기
        </Button>
      </Box>
    </Box>
  );
}

export default SportsWritePage;