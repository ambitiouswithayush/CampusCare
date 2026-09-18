const Notification = require('../models/Notification');
const { getIO } = require('../socket');

// Persists a notification AND pushes it live over Socket.IO so the header
// bell updates instantly without a refresh, while still surviving reloads
// since it's saved to the database.
const notifyUser = async (userId, { type, title, message, link }) => {
  const notification = await Notification.create({ user: userId, type, title, message, link });

  try {
    getIO().to(`user:${userId}`).emit('notification:new', {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      read: notification.read,
      createdAt: notification.createdAt,
    });
  } catch (e) {
    // Socket may not be initialized in a script context - not fatal.
  }

  return notification;
};

const notifyUsers = async (userIds, payload) =>
  Promise.all(userIds.map((id) => notifyUser(id, payload)));

module.exports = { notifyUser, notifyUsers };
