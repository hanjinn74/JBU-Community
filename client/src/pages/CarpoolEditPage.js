import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function CarpoolEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    StartPoint: '',
    EndPoint: '',
    DepartureTime: '' 
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/carpool/${id}`);
        const post = response.data;
        
        // 날짜 형식을 datetime-local input에 맞게 변환 (YYYY-MM-DDTHH:MM)
        const formattedTime = post.DepartureTime ? post.DepartureTime.substring(0, 16) : '';

        setFormData({
          StartPoint: post.StartPoint,
          EndPoint: post.EndPoint,
          DepartureTime: formattedTime
        });

      } catch (error) {
        console.error("원본 데이터를 불러오는 데 실패했습니다.", error);
        alert("데이터를 불러올 수 없습니다.");
        navigate('/');
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
    
    if (!formData.StartPoint || !formData.EndPoint || !formData.DepartureTime) {
      alert('모든 칸을 입력해주세요!');
      return;
    }

    try {
      // 1. 토큰 꺼내기
      const token = sessionStorage.getItem('token'); 

      // 2. PUT 요청 보내기 (인자 순서 주의: 주소 -> 데이터 -> 헤더설정)
      await axios.put(
        `/api/carpool/${id}`, // 주소
        formData,             // 보낼 데이터
        {                     // 설정(헤더)
          headers: {
            Authorization: `Bearer ${token}` // 반드시 백틱(`) 사용
          }
        }
      );
      
      alert('카풀이 성공적으로 수정되었습니다.');
      navigate('/');

    } catch (error) {
      console.error("글 수정 실패:", error);
      if (error.response && error.response.data) {
          alert(`수정 실패: ${error.response.data}`);
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
        📝 카풀 수정하기
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="출발지"
          name="StartPoint"
          value={formData.StartPoint}
          onChange={handleChange}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="도착지"
          name="EndPoint"
          value={formData.EndPoint}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="출발 시간"
          name="DepartureTime"
          type="datetime-local"
          value={formData.DepartureTime}
          onChange={handleChange}
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
        >
          수정 완료하기
        </Button>
      </Box>
    </Box>
  );
}

export default CarpoolEditPage;