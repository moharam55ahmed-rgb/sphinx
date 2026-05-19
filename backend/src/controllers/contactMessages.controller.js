const service = require('../services/contactMessages.service');

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAll(req.query);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const data = await service.updateStatus(req.params.id, req.body.status);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};