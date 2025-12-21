const express = require('express');
const router = express.Router();
const MeetingPost = require('../models/MeetingPost');
const auth = require('../middleware/auth');

// --- [창구 1: 과팅 글 '쓰기'] ---
router.post('/', auth, async (req, res) => {
  try {
    const newPost = new MeetingPost({
      ...req.body,
      // (수정!) req.user._id -> req.user.id
      // 토큰에는 'id'라는 이름으로 정보가 들어있습니다.
      user: req.user.id 
    });
    await newPost.save();
    res.status(201).send('과팅 글이 성공적으로 등록되었습니다.');
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// --- [창구 2: 과팅 글 '전체' 조회] ---
router.get('/', async (req, res) => {
  try {
    const posts = await MeetingPost.find()
      .populate('user', 'nickname') 
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send('목록을 불러오는 데 실패했습니다: ' + error.message);
  }
});

// --- [창구 3: 과팅 글 '1개' 조회] ---
router.get('/:id', async (req, res) => {
  try {
    const post = await MeetingPost.findById(req.params.id).populate('user', 'nickname');
    
    if (!post) {
      return res.status(404).send('해당 글을 찾을 수 없습니다.');
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send('글 조회 실패: ' + error.message);
  }
});

// --- [창구 4: 과팅 글 '삭제'] ---
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await MeetingPost.findById(req.params.id);

    if (!post) return res.status(404).send('글을 찾을 수 없습니다.');

    if (!post.user) {
      return res.status(400).send('작성자 정보가 없는 글입니다.');
    }

    // (수정!) 주인 확인: req.user.id 사용
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send('본인의 글만 삭제할 수 있습니다.');
    }

    await MeetingPost.findByIdAndDelete(req.params.id);
    res.status(200).send('과팅 글이 삭제되었습니다.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// --- [창구 5: 과팅 글 '수정'] ---
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await MeetingPost.findById(req.params.id);
    
    if (!post) return res.status(404).send('글을 찾을 수 없습니다.');

    if (!post.user) {
      return res.status(400).send('작성자 정보가 없는 글입니다.');
    }

    // (수정!) 주인 확인: req.user.id 사용
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send('본인의 글만 수정할 수 있습니다.');
    }

    const { _id, user, createdAt, ...updateData } = req.body;

    const updatedPost = await MeetingPost.findByIdAndUpdate(
      req.params.id,
      // (수정!) 업데이트 시에도 req.user.id 사용
      { ...updateData, user: req.user.id },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;