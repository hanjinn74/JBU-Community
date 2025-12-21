import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

function MeetingEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // 폼 데이터 초기값
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    campus: '',
    gender: '',
    headcount: 2,
    openChatLink: ''
  });

  // 원본 데이터 불러오기 (useEffect)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/meeting/${id}`);
        const post = response.data;

        setFormData({
          title: post.title,
          content: post.content,
          campus: post.campus,
          gender: post.gender,
          headcount: post.headcount,
          openChatLink: post.openChatLink
        });
      } catch (error) {
        console.error("원본 데이터 로딩 실패:", error);
        alert("데이터를 불러올 수 없습니다.");
        navigate('/meeting');
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
      
      // 수정 요청 (PUT) - 헤더에 토큰 포함
      await axios.put(
        `/api/meeting/${id}`, 
        formData, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('과팅 글이 성공적으로 수정되었습니다.');
      navigate('/meeting');

    } catch (error) {
      console.error("글 수정 실패:", error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('글 수정에 실패했습니다.');
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
        📝 과팅 글 수정
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
        
        <TextField
          fullWidth label="제목" name="title"
          value={formData.title} onChange={handleChange}
          margin="normal" required
        />

        <TextField
          select fullWidth label="캠퍼스" name="campus"
          value={formData.campus} onChange={handleChange}
          margin="normal" required
        >
          <MenuItem value="고양">고양캠퍼스</MenuItem>
          <MenuItem value="충청">충청캠퍼스</MenuItem>
        </TextField>

        <TextField
          select fullWidth label="작성자 성별" name="gender"
          value={formData.gender} onChange={handleChange}
          margin="normal" required
        >
          <MenuItem value="남성">남성</MenuItem>
          <MenuItem value="여성">여성</MenuItem>
        </TextField>

        <TextField
          fullWidth label="인원수 (명)" name="headcount" type="number"
          value={formData.headcount} onChange={handleChange}
          margin="normal" required
          inputProps={{ min: 1, max: 10 }}
        />

        <TextField
          fullWidth label="내용 / 자기소개" name="content"
          value={formData.content} onChange={handleChange}
          margin="normal" required multiline rows={4}
        />

        <TextField
          fullWidth label="오픈채팅방 링크" name="openChatLink"
          value={formData.openChatLink} onChange={handleChange}
          margin="normal" required
        />

        <Button
          type="submit" fullWidth variant="contained" color="secondary"
          size="large" sx={{ mt: 3 }}
        >
          수정 완료하기
        </Button>
      </Box>
    </Box>
  );
}

export default MeetingEditPage;