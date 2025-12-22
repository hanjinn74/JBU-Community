import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// (NEW!) 디자인용 아이콘
import FavoriteIcon from '@mui/icons-material/Favorite';
import Paper from '@mui/material/Paper';

function MeetingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myUserId, setMyUserId] = useState(null); // (NEW!) 내 ID 저장용

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // 토큰에서 내 ID 추출 (삭제/수정 버튼 본인 것만 보이게 하기 위해)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setMyUserId(payload.user.id);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/meeting');
        setPosts(response.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`/api/meeting/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(prev => prev.filter(post => post._id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      alert('삭제 실패 (본인 글만 삭제 가능합니다)');
    }
  };

  return (
    <Box>
      {/* 1. (디자인) 상단 배너 (Hero Section) */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', // 핑크빛 그라데이션
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <FavoriteIcon sx={{ fontSize: 50, color: '#ec407a', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" color="#880e4f" gutterBottom>
          설레는 과팅 매칭
        </Typography>
        <Typography variant="body1" color="#ad1457">
          새로운 인연을 만들어보세요! 캠퍼스의 낭만은 여기서 시작됩니다.
        </Typography>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Box>
          {posts.map(post => (
            <Card 
              key={post._id} 
              sx={{ 
                mb: 2, 
                position: 'relative',
                borderRadius: 3, // 둥근 모서리
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // 은은한 그림자
                transition: '0.3s', // 부드러운 애니메이션
                '&:hover': { // 마우스 올렸을 때 효과
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                },
                // (NEW!) 내가 쓴 글은 테두리로 표시
                border: post.user && myUserId === post.user._id ? '2px solid #ec407a' : 'none'
              }}
            >
              <CardContent>
                {/* 뱃지 */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                  <Chip 
                    label={post.campus} 
                    size="small" 
                    sx={{ bgcolor: post.campus === '고양' ? '#e3f2fd' : '#e8f5e9', color: post.campus === '고양' ? '#1565c0' : '#2e7d32', fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={post.gender} 
                    size="small" 
                    sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={`${post.headcount}명`} 
                    size="small" 
                    sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 'bold' }}
                  />
                </Box>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {post.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
                  {post.content}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, borderTop: '1px solid #f0f0f0', pt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    작성자: <strong>{post.user ? post.user.nickname : '알 수 없음'}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  disableElevation
                  href={post.openChatLink} 
                  target="_blank"
                  sx={{ 
                    bgcolor: '#fee500', // 카카오톡 노란색
                    color: '#3c1e1e',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#fdd835' }
                  }}
                >
                  오픈채팅 참여하기
                </Button>
              </CardActions>

              {isLoggedIn && (
                <>
                  <IconButton
                    component={Link}
                    to={`/meeting/edit/${post._id}`}
                    sx={{ position: 'absolute', top: 10, right: 48, color: '#9e9e9e' }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDelete(post._id)}
                    sx={{ position: 'absolute', top: 10, right: 8, color: '#e57373' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Card>
          ))}

          {posts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
              <Typography>등록된 글이 없습니다. 첫 번째 주인공이 되어보세요!</Typography>
            </Box>
          )}
        </Box>
      )}

      {isLoggedIn && (
        <Fab
          aria-label="add"
          component={Link}
          to="/meeting/write"
          sx={{ 
            position: 'fixed', 
            bottom: 32, 
            right: 32,
            bgcolor: '#ec407a', // 과팅 테마색 (핑크)
            color: 'white',
            '&:hover': { bgcolor: '#d81b60' }
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default MeetingPage;