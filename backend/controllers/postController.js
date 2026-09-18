const Post = require('../models/post');
const { getIO } = require('../socket');
const { notifyUser } = require('../utils/notify');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (Student)
exports.createPost = async (req, res) => {
  try {
    const { content, anonymous } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required',
      });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      anonymous: anonymous || false,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .populate('replies.user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reply to a post
// @route   POST /api/posts/:id/reply
// @access  Private
exports.replyToPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.replies.push({
      user: req.user._id,
      content,
    });

    await post.save();
    await post.populate('replies.user', 'name');

    const reply = post.replies[post.replies.length - 1];

    getIO().to(`post:${post._id}`).emit('post:reply', {
      postId: post._id,
      reply,
    });

    if (post.user.toString() !== req.user._id.toString()) {
      notifyUser(post.user, {
        type: 'post_reply',
        title: 'New reply to your post',
        message: content.length > 80 ? `${content.slice(0, 80)}...` : content,
        link: '/community',
      }).catch((err) => console.error('Notification failed:', err.message));
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
