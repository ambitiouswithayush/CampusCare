const express = require('express');
const {
  createPost,
  getPosts,
  replyToPost,
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create post
router.post('/', protect, createPost);

// View all posts
router.get('/', protect, getPosts);

// Reply to a post
router.post('/:id/reply', protect, replyToPost);

module.exports = router;
