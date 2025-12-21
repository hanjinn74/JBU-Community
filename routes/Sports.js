const express = require('express');
const router = express.Router();
const SportsPost = require('../models/SportsPost');
const auth = require('../middleware/auth');

// --- [창구 1: 스포츠 글 '쓰기'] ---
router.post('/', auth, async (req, res) => {
  try {
    const newPost = new SportsPost({
      ...req.body,
      user: req.user.id // 로그인한 유저 ID
    });
    await newPost.save();
    res.status(201).send('스포츠 매칭 글이 등록되었습니다.');
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// --- [창구 2: 스포츠 글 '전체' 조회] ---
router.get('/', async (req, res) => {
  try {
    const posts = await SportsPost.find()
      .populate('user', 'nickname')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// --- [창구 3: 스포츠 글 '1개' 조회] ---
router.get('/:id', async (req, res) => {
  try {
    const post = await SportsPost.findById(req.params.id).populate('user', 'nickname');
    if (!post) return res.status(404).send('글을 찾을 수 없습니다.');
    res.status(200).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// --- [창구 4: 스포츠 글 '삭제'] ---
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await SportsPost.findById(req.params.id);
    if (!post) return res.status(404).send('글을 찾을 수 없습니다.');

    if (!post.user) return res.status(400).send('작성자 정보가 없습니다.');

    // 본인 확인
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send('본인의 글만 삭제할 수 있습니다.');
    }

    await SportsPost.findByIdAndDelete(req.params.id);
    res.status(200).send('삭제되었습니다.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// --- [창구 5: 스포츠 글 '수정'] ---
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await SportsPost.findById(req.params.id);
    if (!post) return res.status(404).send('글을 찾을 수 없습니다.');

    if (!post.user) return res.status(400).send('작성자 정보가 없습니다.');

    // 본인 확인
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send('본인의 글만 수정할 수 있습니다.');
    }

    const { _id, user, createdAt, ...updateData } = req.body;

    const updatedPost = await SportsPost.findByIdAndUpdate(
      req.params.id,
      { ...updateData, user: req.user.id },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;