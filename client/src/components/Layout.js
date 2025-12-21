import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; 

function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 1. (NEW!) 닉네임 상태 추가
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    // 2. (NEW!) 저장된 닉네임 꺼내기
    const savedNickname = sessionStorage.getItem('nickname');
    
    if (token) {
      setIsLoggedIn(true);
      if (savedNickname) {
        setNickname(savedNickname); // 상태 업데이트
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nickname'); // 3. (NEW!) 닉네임도 같이 삭제
    setIsLoggedIn(false);
    setNickname('');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      
      <AppBar position="static">
        <Toolbar>
          
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            JBU-Community
          </Typography>

          <Box sx={{ flexGrow: 1 }} /> 

          <Button component={Link} to="/" color="inherit">
            카풀
          </Button>
          <Button component={Link} to="/meeting" color="inherit">
            과팅
          </Button>
          <Button component={Link} to="/sports" color="inherit">
            스포츠
          </Button>

          {isLoggedIn ? (
            <>
              {/* 4. (NEW!) 닉네임 표시 */}
              <Typography variant="body1" sx={{ mr: 2, fontWeight: 'bold' }}>
                {nickname}님
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">
                로그인
              </Button>
              <Button component={Link} to="/register" color="inherit">
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