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
import EditIcon from '@mui/icons-material/Edit'; // 수정 아이콘 추가
import CommentSection from '../components/CommentSection';

function MeetingPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) setIsLoggedIn(true);
    
    axios.get('/api/meeting')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`/api/meeting/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(prev => prev.filter(post => post._id !== id));
      alert('삭제되었습니다.');
    } catch (error) {
      if (error.response && error.response.data) alert(error.response.data);
      else alert('삭제 실패 (본인 글만 삭제 가능합니다)');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>💖 과팅 매칭</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        <Box>
          {posts.map(post => (
            <Card key={post._id} sx={{ mb: 2, position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip label={post.campus} color={post.campus === '고양' ? 'primary' : 'secondary'} size="small" />
                  <Chip label={post.gender} variant="outlined" size="small" />
                  <Chip label={`${post.headcount}명`} size="small" sx={{ backgroundColor: '#ffcc80' }} />
                  <Typography variant="h6">{post.title}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>{post.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  작성자: {post.user ? post.user.nickname : '알 수 없음'} | 
                  작성일: {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
                <CommentSection 
                            postId={post._id} 
                            postModel="MeetingPost" 
                            isLoggedIn={isLoggedIn} 
                        />
              </CardContent>
              <CardActions>
                <Button size="small" href={post.openChatLink} target="_blank">오픈채팅 참여하기</Button>
              </CardActions>
              
              {/* 로그인 상태일 때 수정/삭제 버튼 노출 */}
              {isLoggedIn && (
                <>
                  {/* 수정 버튼 (삭제 버튼 왼쪽에 위치) */}
                  <IconButton
                    component={Link}
                    to={`/meeting/edit/${post._id}`}
                    sx={{ position: 'absolute', top: 8, right: 56 }}
                  >
                    <EditIcon />
                  </IconButton>

                  {/* 삭제 버튼 */}
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
          {posts.length === 0 && <Typography>등록된 과팅 글이 없습니다.</Typography>}
        </Box>
      )}
      {isLoggedIn && (
        <Fab color="secondary" component={Link} to="/meeting/write" sx={{ position: 'fixed', bottom: 32, right: 32 }}>
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default MeetingPage;