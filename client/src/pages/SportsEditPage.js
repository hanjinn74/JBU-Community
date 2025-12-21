import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

function SportsEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sportType: '',
    headcount: 1,
    date: '',
    location: '',
    openChatLink: ''
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/sports/${id}`);
        const post = response.data;

        // 날짜 포맷 변환 (YYYY-MM-DDTHH:MM)
        const formattedDate = post.date ? post.date.substring(0, 16) : '';

        setFormData({
          title: post.title,
          content: post.content,
          sportType: post.sportType,
          headcount: post.headcount,
          date: formattedDate,
          location: post.location,
          openChatLink: post.openChatLink
        });
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("데이터를 불러올 수 없습니다.");
        navigate('/sports');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

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
      
      await axios.put(
        `/api/sports/${id}`, 
        formData, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('수정되었습니다.');
      navigate('/sports');

    } catch (error) {
      console.error("수정 실패:", error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('수정 실패');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📝 스포츠 매칭 수정
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
          수정 완료
        </Button>
      </Box>
    </Box>
  );
}

export default SportsEditPage;