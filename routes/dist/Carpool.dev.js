"use strict";

//1. express의 router 기능 가져오기
var express = require('express');

var router = express.Router(); // 이제 'app' 대신 'router'가 실무역할
//2. 카풀 로봇(Model) 불러오기

var CarpoolPost = require('../models/CarpoolPost'); //카풀 API(창구) 만들어보자!
// [창구 1: 글쓰기] (POST /router/Carpool) - 위에 작성됬나?
// React 손님이 5000 주소로 주문서(body)를 보내면


router.post('/', function _callee(req, res) {
  var newPost;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //1. 손님의 주문서(body)를 받아서(req.body), 카풀 로봇을 이용해 새 데이터 만듦
          newPost = new CarpoolPost(req.body); //2. 로봇에게 '창고에 저장해!' 명령하면 (DB에 저장함 -시간 걸릴 수 있으니 'await')

          _context.next = 4;
          return regeneratorRuntime.awrap(newPost.save());

        case 4:
          //3. 손님에게 '주문 완료!' 응답해줘야겠죠?
          res.status(201).send('카풀 글이 성공적으로 등록됬어요~');
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          //4. 만약 설계도에 안 맞는 주문이 들어오면 error 보냄.
          res.status(400).send('글 등록이 안됬어요 ㅠㅠ: ' + _context.t0.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // [창구 2: 목록 보기](GET /router/Carpool)
// 예민한 (React) 손님이 5000번 창구로 조회 요청하면

router.get('/', function _callee2(req, res) {
  var posts;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(CarpoolPost.find().sort({
            createdAt: -1
          }));

        case 3:
          posts = _context2.sent;
          //.sort(): 최신순 정렬
          //2. 손님에게 찾아온 '데이터 목록(Posts)'을 Json 형태로 보여줌.
          res.status(200).json(posts);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).send('목록을 못 가져왔어요!:' + _context2.t0.message);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // 카풀 글 삭제 1. DELETE 메소드를 쓰고 '주소 뒤에 ID'를 받도록 설정

router["delete"]('/:id', function _callee3(req, res) {
  var postId, deletedPost;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          //2. URL 주소에서 ID 값을 뽑아냄(req.params.id)
          postId = req.params.id; //3. ** 카풀 로봇한테 해당 ID로 글을 찾아서 삭제 명령

          _context3.next = 4;
          return regeneratorRuntime.awrap(CarpoolPost.findByIdAndDelete(postId));

        case 4:
          deletedPost = _context3.sent;

          if (deletedPost) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).send('해당 ID 카풀 글을 찾을 수 없음.'));

        case 7:
          return _context3.abrupt("return", res.status(200).send('카풀 글이 성공적으로 삭제됨.'));

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          //6. DB에러 ex) ID 형식 틀림
          res.status(500).send('카풀 글 삭제 중 서버 에러 발생: ' + _context3.t0.message);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); // 창구 4: 카풀 글 1개 조회(수정 폼에 원본 data 채워 넣을 때 사용)
// 주소: GET /api/carpool/12345

router.get('/:id', function _callee4(req, res) {
  var postId, post;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          postId = req.params.id; //카풀 로봇한테 해당 Id로 글 불러오라 명령

          _context4.next = 4;
          return regeneratorRuntime.awrap(CarpoolPost.findById(postId));

        case 4:
          post = _context4.sent;

          if (post) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).send('해당 ID의 카풀 글을 찾을 수 없습니다.'));

        case 7:
          // 찾을 글 1개를 JSON 형태로 손님(프론트엔드)에 보냄
          res.status(200).json(post);
          _context4.next = 13;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          res.status(500).send('글 조회 중 서버 에러가 발생했습니다: ' + _context4.t0.message);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); // 창구 5: 카풀 글 1개 수정하기(수정폼에서 제출 버튼 누를 때 사용)
// 주소: PUT /api/carpool/12345

router.put('/:id', function _callee5(req, res) {
  var postId, updatedData, updatedPost;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          postId = req.params.id;
          updatedData = req.body; //수정된 폼 데이터(StartPoint, EndPoint 등등)
          // ** 카풀 로봇에게 이 ID(postId) 찾아서, 이 데이터(updatedData)로 수정 명령
          // {new: true } 옵션은 '수정된 후'의 최신 데이터 반환하라는 뜻(안 쓰면 수정 전 데이터 나옴)

          _context5.next = 5;
          return regeneratorRuntime.awrap(CarpoolPost.findByIdAndUpdate(postId, updatedData, {
            "new": true
          }));

        case 5:
          updatedPost = _context5.sent;

          if (updatedPost) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).send('해당 ID의 카풀 글을 찾을 수 없습니다.'));

        case 8:
          // 성공하면! 수정된 최신 글을 프론트엔드(손님)에게
          res.status(200).json(updatedPost);
          _context5.next = 14;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          res.status(500).send('글 수정 중 서버 에러가 발생했습니다: ' + _context5.t0.message);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
module.exports = router;