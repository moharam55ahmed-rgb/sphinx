const service = require('../services/public.service');

exports.getHomeData = async (req, res, next) => {
  try {
    const data = await service.getHomeData();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getPageBySlug = async (req, res, next) => {
  try {
    const data = await service.getPageBySlug(req.params.slug);
    if (!data) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getProjects = async (req, res, next) => {
  try {
    const data = await service.getProjects(req.query);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getProjectBySlug = async (req, res, next) => {
  try {
    const data = await service.getProjectBySlug(req.params.slug);
    if (!data) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const data = await service.getCategories();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getSettings = async (req, res, next) => {
  try {
    const data = await service.getSettings();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getNavigation = async (req, res, next) => {
  try {
    const data = await service.getNavigation(req.params.location);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getSeoBySlug = async (req, res, next) => {
  try {
    const data = await service.getSeoBySlug(req.params.slug);
    if (!data) return res.status(404).json({ success: false, message: 'SEO data not found' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getNews = async (req, res, next) => {
  try {
    const data = await service.getNews(req.query);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getNewsBySlug = async (req, res, next) => {
  try {
    const data = await service.getNewsBySlug(req.params.slug);
    if (!data) return res.status(404).json({ success: false, message: 'News article not found' });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

exports.getNewsCategories = async (req, res, next) => {
  try {
    const data = await service.getNewsCategories();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getGalleryCategories = async (req, res, next) => {
  try {
    const data = await service.getGalleryCategories();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getGallery = async (req, res, next) => {
  try {
    const data = await service.getGallery(req.query.type, req.query.category);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.submitContact = async (req, res, next) => {
  try {
    const data = await service.submitContact(req.body);
    res.status(201).json({ success: true, data, message: 'Message sent successfully' });
  } catch (err) { next(err); }
};

exports.recordVisit = async (req, res, next) => {
  try {
    const analytics = require('../services/analytics.service');
    const data = await analytics.recordVisit(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
