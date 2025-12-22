import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 
// (NEW!) 학교 아이콘 느낌을 위한 학사모 아이콘
import SchoolIcon from '@mui/icons-material/School'; 

function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedNickname = sessionStorage.getItem('nickname');
    
    if (token) {
      setIsLoggedIn(true);
      if (savedNickname) setNickname(savedNickname);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nickname');
    setIsLoggedIn(false);
    setNickname('');
    alert('로그아웃 되었습니다.');
    navigate('/');
    window.location.reload();
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* 1. (디자인) 그라데이션 상단바 */}
      <AppBar position="static" elevation={0} sx={{ 
        background: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)', // 세련된 네이비/블루 그라데이션
        paddingY: 1 
      }}>
        <Toolbar>
          
          {/* 2. (디자인) 로고 강조 */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit',
              mr: 3 
            }}
          >
            <SchoolIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              JBU-Community
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} /> 

          {/* 메뉴 버튼들 */}
          <Button component={Link} to="/" color="inherit" sx={{ fontWeight: 'bold' }}>카풀</Button>
          <Button component={Link} to="/meeting" color="inherit" sx={{ fontWeight: 'bold' }}>과팅</Button>
          <Button component={Link} to="/sports" color="inherit" sx={{ fontWeight: 'bold' }}>스포츠</Button>

          {/* 구분선 */}
          <Box sx={{ width: '1px', height: '20px', bgcolor: 'rgba(255,255,255,0.3)', mx: 2 }} />

          {isLoggedIn ? (
            <>
              <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                <span style={{color: '#ffd700'}}>Hello,</span> {nickname}님
              </Typography>
              <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ borderRadius: 20, borderColor: 'rgba(255,255,255,0.5)' }}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">로그인</Button>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained" 
                sx={{ 
                  bgcolor: 'white', 
                  color: '#182848', 
                  fontWeight: 'bold',
                  borderRadius: 20,
                  '&:hover': { bgcolor: '#e0e0e0' }
                }}
              >
                회원가입
              </Button>
            </>
          )}

        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;