const express = require('express');
const router = express.Router();
const CarpoolPost = require('../models/CarpoolPost');
const auth = require('../middleware/auth');

// --- [창구 1: 카풀 글 '쓰기'] ---
router.post('/', auth, async (req, res) => {
  try {
    const newPost = new CarpoolPost({
      ...req.body,
      
      user: req.user.id 
    });
    await newPost.save();
    res.status(201).send('카풀 글이 성공적으로 등록되었습니다.');
  } catch (error) { 
    console.error(error);
    res.status(400).send(error.message); 
  }
});

// --- [창구 2: 카풀 글 '전체' 조회] ---
router.get('/', async (req, res) => {
  try {
    const posts = await CarpoolPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send('목록을 불러오는 데 실패했습니다: ' + error.message);
  }
});

// --- [창구 4: 카풀 글 '1개' 조회] ---
router.get('/:id', async (req, res) => {
  try {
    const post = await CarpoolPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).send('해당 ID의 카풀 글을 찾을 수 없습니다.');
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send('글 조회 실패: ' + error.message);
  }
});

// --- [창구 3: 카풀 글 '삭제'] ---
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await CarpoolPost.findById(req.params.id);

    if (!post) return res.status(404).send('글을 찾을 수 없습니다.');

    // 작성자 정보가 없는 경우 (예외 처리)
    if (!post.user) {
      return res.status(400).send('작성자 정보가 없는 글입니다.');
    }

    // [디버깅용 로그] ID가 달라서 삭제가 안 될 때, 서버 콘솔에서 확인 가능
    if (post.user.toString() !== req.user.id.toString()) {
      console.log(`[삭제 거부] 글 주인: ${post.user}, 요청자: ${req.user.id}`);
      return res.status(401).send('본인의 글만 삭제할 수 있습니다.');
    }

    await CarpoolPost.findByIdAndDelete(req.params.id);
    res.status(200).send('카풀 글이 삭제되었습니다.');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// --- [창구 5: 카풀 글 '수정'] ---
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await CarpoolPost.findById(req.params.id);
    
    if (!post) return res.status(404).send('글을 찾을 수 없습니다.');

    if (!post.user) {
      return res.status(400).send('작성자 정보가 없는 글입니다.');
    }

    // [디버깅용 로그]
    if (post.user.toString() !== req.user.id.toString()) {
      console.log(`[수정 거부] 글 주인: ${post.user}, 요청자: ${req.user.id}`);
      return res.status(401).send('본인의 글만 수정할 수 있습니다.');
    }

    // _id 등 변경하면 안 되는 필드는 제외하고 업데이트
    const { _id, user, createdAt, ...updateData } = req.body;

    const updatedPost = await CarpoolPost.findByIdAndUpdate(
      req.params.id,
      { ...updateData, user: req.user.id }, // user 정보는 안전하게 다시 덮어쓰기
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;