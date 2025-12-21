import React from 'react'; //index.js는 리액트의 대문이에요~ 라우터 쓴다 선언
import ReactDOM from 'react-dom/client';
// 1. 라우터를 가져옴
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> {/* <App />을 <BrowerRouter>로 감싸줌 */}
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

