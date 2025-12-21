import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; //페이지 이동용

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'; // '입력창'
import Button from '@mui/material/Button';       // '버튼'


function CarpoolWritePage() {

  const navigate = useNavigate(); //페이지 이동 기능 준비

  // 폼 데이터를 '기억'할 '기억상자(State)'를 만들자.
  // 이 하나의 'formData' 객체 안에 모든 입력값을 한꺼번에 관리할 거야.
  const [formData, setFormData] = useState({
    StartPoint: '',     // (주의!) 백엔드 모델(CarpoolPost.js)의 키 이름과
    EndPoint: '',       // '대소문자'까지 100% 똑같아야 해!
    DepartureTime: ''   // (일단 문자열로 받고, 나중에 날짜 타입으로 바꿈
  });

// 6. (NEW!) 입력창에 글자를 '칠 때마다' 실행될 함수
  const handleChange = (e) => {
    // e.target.name : 입력창의 '이름' (예: "StartPoint")
    // e.target.value : 방금 '입력된 값' (예: "충청캠")
    setFormData({
      ...formData, // '기존 데이터'는 그대로 복사하고,
      [e.target.name]: e.target.value // '방금 바뀐' 값만 덮어쓰기
    });
  };

  // 7. (NEW!) '제출' 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!formData.StartPoint || !formData.EndPoint || !formData.DepartureTime) {
      alert('모든 칸을 입력해주세요!');
      return;
    }

    try {
      // 1. (NEW!) '영구 보관함'에서 '출입증(token)' 꺼내기
      const token = sessionStorage.getItem('token');

      // 2. (NEW!) axios 요청에 '헤더(headers)' 추가하기
      //    "경비원 아저씨, 여기 제 출입증(Authorization) 있어요!"
      await axios.post(
        '/api/carpool', 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}` // 'Bearer ' 뒤에 토큰을 붙여서 보냄
          }
        }
      );
      
      alert('카풀이 성공적으로 등록되었습니다.');
      navigate('/');

    } catch (error) {
      console.error("상세 에러:", error);

      // 🔥 백엔드가 보낸 '진짜 이유'를 팝업으로 띄우기
      if (error.response && error.response.data) {
        alert(`저런! 에러가 났네요: ${error.response.data}`);
      } else {
        alert('글 등록에 실패했습니다. (서버 응답 없음)');
      }
    }
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🚗 카풀 등록하기
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {/* '출발지' 입력창 */}
        <TextField
          fullWidth // 화면에 꽉 차게
          label="출발지 (예: 충청캠퍼스)" // 입력창 위에 뜨는 안내 문구
          name="StartPoint" // (중요!) 6번 handleChange의 'e.target.name'
          value={formData.StartPoint} // 5번 '기억상자'의 값을 보여줌
          onChange={handleChange}     // '입력할 때마다' 6번 함수 실행
          margin="normal"           // 위아래 적당한 여백
          required                  // HTML 기본 '필수' 항목
        />
        
        {/* '도착지' 입력창 */}
        <TextField
          fullWidth
          label="도착지 (예: 고양캠퍼스)"
          name="EndPoint" // (중요!)
          value={formData.EndPoint}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* '출발 시간' 입력창 */}
        {/* HTML5의 'datetime-local' 타입을 써서 날짜/시간 선택기를 띄움. */}
        <TextField
          fullWidth
          label="출발 시간"
          name="DepartureTime" // (중요!)
          type="datetime-local" // 이게 날짜/시간 선택기를 띄워줌, 쓰려면 shrink:true는 필수임
          value={formData.DepartureTime}
          onChange={handleChange}
          margin="normal"
          required
          // (NEW!) 'shrink: true'는 label이 입력창 위에 항상 떠있게 만들어줘.
          //       (type="datetime-local" 쓸 때 필수 세팅)
          InputLabelProps={{
            shrink: true,
          }}
        />
      {/* '제출' 버튼 */}
        <Button
          type="submit" // 폼 안의 'submit' 타입 버튼은 'onSubmit'을 실행시킴
          variant="contained" // MUI의 파란색 꽉 찬 버튼
          color="primary"
          size="large"
          sx={{ mt: 2 }} // 위쪽 여백
        >
          카풀 등록하기
        </Button>
      </Box>
    </Box>
  );
}

export default CarpoolWritePage;