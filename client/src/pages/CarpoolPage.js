import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CommentSection from '../components/CommentSection';

function CarpoolPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/carpool');
                setPosts(response.data);
            } catch (error) {
                console.error("데이터 불러오는데 실패했어요", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("카풀 글을 삭제합니까?")) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`/api/carpool/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
            alert('삭제되었습니다.');

        } catch (error) {
            console.error("삭제 중 에러가 발생했습니다.", error);
            if (error.response && error.response.data) {
                alert(`삭제 실패: ${error.response.data}`);
            } else {
                alert('삭제에 실패했습니다.');
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                🚗 카풀 목록
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {posts.map((post) => (
                        <Card key={post._id} sx={{ mb: 2, position: 'relative'}}>
                            <CardContent>
                                <Typography variant="h6">
                                    출발: {post.StartPoint}
                                </Typography>
                                <Typography variant="h6">
                                    도착: {post.EndPoint}
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 1 }}>
                                    출발 시간: {new Date(post.DepartureTime).toLocaleString('ko-KR')}
                                </Typography>
                                
                                {/* (NEW!) 작성자 닉네임 표시 */}
                                <Typography variant="caption" display="block" color="text.secondary">
                                    작성자: {post.user ? post.user.nickname : '알 수 없음'}
                                </Typography>
                                <CommentSection 
                            postId={post._id} 
                            postModel="CarpoolPost" 
                            isLoggedIn={isLoggedIn} 
                        />
                            </CardContent>

                            {isLoggedIn && (
                                <>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDelete(post._id)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                    <IconButton
                                        aria-label="edit"
                                        component={Link}
                                        to={`/carpool/edit/${post._id}`} 
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 56,
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </>
                            )}
                            
                        </Card>
                    ))}
                    
                    {posts.length === 0 && (
                        <Typography>아직 등록된 카풀이 없습니다.</Typography>
                    )}
                </Box>
            )}
    
            {isLoggedIn && (
                <Fab
                    color="primary"
                    aria-label="add"
                    component={Link}
                    to="/carpool/write"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                    }}
                >
                    <AddIcon />
                </Fab>
            )}

        </Box>
    );
}

export default CarpoolPage;