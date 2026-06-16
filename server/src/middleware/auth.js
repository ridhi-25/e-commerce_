const User = require('../models/User');

async function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      return req.session.destroy(() => {
        res.status(401).json({ message: 'Session invalid' });
      });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  try {
    const user = await User.findById(req.session.userId).lean();
    if (!user) {
      return req.session.destroy(() => {
        res.status(401).json({ message: 'Session invalid' });
      });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { requireLogin, requireAdmin };
