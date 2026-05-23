const service = require('../services/media.service');

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const showInGallery =
      req.body.showInGallery === true ||
      req.body.showInGallery === 'true' ||
      req.body.showInGallery === '1';

    const mediaData = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: fileUrl,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
      altText: req.body.altText || '',
      title: req.body.title || '',
      showInGallery,
      galleryCategoryId: req.body.galleryCategoryId || null,
    };
    
    const data = await service.create(mediaData);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

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