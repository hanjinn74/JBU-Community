import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Collapse
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function CommentSection({ postId, postModel, isLoggedIn }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  // 댓글 불러오기 함수
  const fetchComments = async () => {
    try {
      setLoading(true);
      // 백엔드: GET /api/comments/:postModel/:postId
      const response = await axios.get(`/api/comments/${postModel}/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error("댓글 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // '댓글 보기/접기' 버튼 클릭 시
  const handleToggle = () => {
    if (!showComments) {
      fetchComments(); // 열릴 때 데이터 가져오기 (데이터 절약)
    }
    setShowComments(!showComments);
  };

  // 댓글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = sessionStorage.getItem('token');
      // 백엔드: POST /api/comments
      const response = await axios.post('/api/comments', {
        content: newComment,
        postId,
        postModel
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 목록에 새 댓글 추가 (새로고침 없이 반영)
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      alert("댓글 등록에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if(!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`/api/comments/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // 목록에서 삭제된 댓글 제외
        setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
        alert("삭제 실패 (본인 댓글만 삭제 가능합니다)");
    }
  }

  // 현재 로그인한 내 ID 알아내기 (삭제 버튼 표시용)
  const getCurrentUserId = () => {
      const token = sessionStorage.getItem('token');
      if (!token) return null;
      try {
          // JWT 토큰 디코딩 (라이브러리 없이 간단하게)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          return payload.user.id;
      } catch (e) {
          return null;
      }
  };
  const currentUserId = getCurrentUserId();

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      {/* 댓글 보기/접기 버튼 */}
      <Button
        startIcon={<ChatBubbleOutlineIcon />}
        onClick={handleToggle}
        size="small"
        sx={{ mb: 1 }}
      >
        댓글 {showComments ? '접기' : '보기'}
      </Button>

      {/* 댓글 영역 (Collapse로 열고 닫힘) */}
      <Collapse in={showComments}>
        <Box sx={{ bgcolor: '#fafafa', p: 2, borderRadius: 2, border: '1px solid #eee' }}>
            
            {/* 댓글 목록 */}
            <List dense>
                {comments.map((comment) => (
                    <React.Fragment key={comment._id}>
                        <ListItem
                            alignItems="flex-start"
                            // 내가 쓴 댓글이면 삭제 버튼 표시
                            secondaryAction={
                                isLoggedIn && comment.user && currentUserId === comment.user._id && (
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(comment._id)} size="small">
                                        <DeleteIcon fontSize="small" color="disabled" />
                                    </IconButton>
                                )
                            }
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                        {comment.user ? comment.user.nickname : '알 수 없음'}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" component="span" color="text.primary" sx={{ display: 'block', my: 0.5 }}>
                                            {comment.content}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider component="li" variant="inset" />
                    </React.Fragment>
                ))}
                {comments.length === 0 && !loading && (
                    <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                        첫 번째 댓글을 남겨보세요!
                    </Typography>
                )}
            </List>

            {/* 댓글 입력 폼 (로그인 시에만 보임) */}
            {isLoggedIn ? (
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="댓글을 입력하세요..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        sx={{ bgcolor: 'white' }}
                    />
                    <Button type="submit" variant="contained" size="small" disableElevation>
                        등록
                    </Button>
                </Box>
            ) : (
                <Typography variant="caption" display="block" sx={{ textAlign: 'center', mt: 1, color: 'text.secondary' }}>
                    댓글을 작성하려면 로그인이 필요합니다.
                </Typography>
            )}
        </Box>
      </Collapse>
    </Box>
  );
}

export default CommentSection;