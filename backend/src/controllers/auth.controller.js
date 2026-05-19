const service = require('../services/auth.service');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await service.login(email, password);
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === 'Invalid credentials') return res.status(401).json({ success: false, message: err.message });
    next(err);
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.me = (req, res) => {
  res.json({ success: true, data: req.user });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await service.changePassword(req.user.id, oldPassword, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};