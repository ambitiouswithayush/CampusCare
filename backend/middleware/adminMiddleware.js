// Admin-only middleware
// Ensures only users with 'admin' role can access protected routes

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access only',
    });
  }
};
