const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

let io;

const initSocket = (httpServer, corsOptions) => {
  io = new Server(httpServer, {
    cors: corsOptions,
  });

  // Authenticate every socket using the same JWT issued by the REST login
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Not authorized, token missing'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('Not authorized, user not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Not authorized, token invalid'));
    }
  });

  io.on('connection', (socket) => {
    // Personal room: used to push things at exactly this user
    socket.join(`user:${socket.user._id}`);
    // Role room: used for role-wide broadcasts (e.g. admin alerts)
    socket.join(`role:${socket.user.role}`);

    socket.on('post:join', (postId) => socket.join(`post:${postId}`));
    socket.on('post:leave', (postId) => socket.leave(`post:${postId}`));
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
