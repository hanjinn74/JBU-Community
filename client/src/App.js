import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import CarpoolPage from './pages/CarpoolPage';
import MeetingPage from './pages/MeetingPage';
import CarpoolWritePage from './pages/CarpoolWritePage';
import CarpoolEditPage from './pages/CarpoolEditPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MeetingWritePage from './pages/MeetingWritePage';
// (필수) 과팅 수정 페이지 import
import MeetingEditPage from './pages/MeetingEditPage';
import SportsPage from './pages/SportsPage';
import SportsWritePage from './pages/SportsWritePage';
import SportsEditPage from './pages/SportsEditPage';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* --- 카풀 --- */}
        <Route index element={<CarpoolPage />} />
        <Route path="carpool/write" element={<CarpoolWritePage />} /> 
        <Route path="carpool/edit/:id" element={<CarpoolEditPage />} />
        
        {/* --- 과팅 --- */}
        <Route path="meeting" element={<MeetingPage />} /> 
        <Route path="meeting/write" element={<MeetingWritePage />} />
        
        {/*  과팅 수정 경로 등록 */}
        <Route path="meeting/edit/:id" element={<MeetingEditPage />} />

        {/* --- 회원 --- */}
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* --- 스포츠 --- */}  
        <Route path="sports" element={<SportsPage />} />
        <Route path="sports/write" element={<SportsWritePage />} />
        <Route path="sports/edit/:id" element={<SportsEditPage />} />
      </Route>
    </Routes>
  );
}

export default App;