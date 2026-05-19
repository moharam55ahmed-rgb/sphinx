const service = require('../services/analytics.service');

exports.getStats = async (req, res, next) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
