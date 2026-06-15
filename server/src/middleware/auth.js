const User = require('../models/User');

async function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  req.user = await User.findById(req.session.userId).lean();
  next();
}

async function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  const user = await User.findById(req.session.userId).lean();
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  req.user = user;
  next();
}

module.exports = { requireLogin, requireAdmin };
