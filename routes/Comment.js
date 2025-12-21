const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// --- [창구 1: 댓글 '쓰기'] ---
// 주소: POST /api/comments
router.post('/', auth, async (req, res) => {
  try {
    const { content, postId, postModel } = req.body;

    const newComment = new Comment({
      content,
      post: postId,       // 어떤 글인지 (_id)
      postModel,          // 어떤 종류인지 ('CarpoolPost' 등)
      user: req.user.id   // 작성자
    });

    await newComment.save();
    
    // 저장 후 작성자 정보까지 포함해서 응답 (바로 화면에 띄우기 위해)
    const savedComment = await Comment.findById(newComment._id).populate('user', 'nickname');
    
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// --- [창구 2: 특정 글의 댓글 '전체 조회'] ---
// 주소: GET /api/comments/:postModel/:postId
router.get('/:postModel/:postId', async (req, res) => {
  try {
    const { postModel, postId } = req.params;

    const comments = await Comment.find({ post: postId, postModel: postModel })
      .populate('user', 'nickname') // 작성자 닉네임 가져오기
      .sort({ createdAt: 1 });      // 작성된 순서대로 (오래된 게 위로)

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// --- [창구 3: 댓글 '삭제'] ---
// 주소: DELETE /api/comments/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send('댓글을 찾을 수 없습니다.');

    // 본인 확인
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).send('본인의 댓글만 삭제할 수 있습니다.');
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).send('댓글이 삭제되었습니다.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;