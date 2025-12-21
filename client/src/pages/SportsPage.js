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
import EventIcon from '@mui/icons-material/Event'; // 날짜 아이콘
import PlaceIcon from '@mui/icons-material/Place'; // 장소 아이콘
import CommentSection from '../components/CommentSection';

function SportsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/sports');
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
      await axios.delete(`/api/sports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(prev => prev.filter(post => post._id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('삭제 실패 (본인 글만 삭제 가능합니다)');
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ⚽ 스포츠 매칭
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {posts.map(post => (
            <Card key={post._id} sx={{ mb: 2, position: 'relative' }}>
              <CardContent>
                {/* 상단 뱃지 (종목, 인원) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                  <Chip 
                    label={post.sportType} 
                    color="success" 
                    size="small" 
                  />
                  <Chip 
                    label={`모집: ${post.headcount}명`} 
                    variant="outlined" 
                    size="small" 
                  />
                  <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                    {post.title}
                  </Typography>
                </Box>

                {/* 날짜 & 장소 정보 */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {new Date(post.date).toLocaleString('ko-KR')}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    <PlaceIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {post.location}
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>
                
                <Typography variant="caption" display="block" color="text.secondary">
                  작성자: {post.user ? post.user.nickname : '알 수 없음'}
                </Typography>
                <CommentSection 
                            postId={post._id} 
                            postModel="SportsPost" 
                            isLoggedIn={isLoggedIn} 
                        />
              </CardContent>

              <CardActions>
                <Button size="small" href={post.openChatLink} target="_blank">
                  연락하기 / 참여하기
                </Button>
              </CardActions>

              {isLoggedIn && (
                <>
                  <IconButton
                    component={Link}
                    to={`/sports/edit/${post._id}`}
                    sx={{ position: 'absolute', top: 8, right: 56 }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDelete(post._id)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Card>
          ))}

          {posts.length === 0 && (
            <Typography>등록된 스포츠 매칭 글이 없습니다.</Typography>
          )}
        </Box>
      )}

      {isLoggedIn && (
        <Fab
          color="success" // 스포츠는 초록색(success) 느낌!
          aria-label="add"
          component={Link}
          to="/sports/write"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default SportsPage;