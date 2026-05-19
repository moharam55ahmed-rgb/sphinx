const newsService = require('../services/news.service');

const getNews = async (req, res) => {
  try {
    const result = await newsService.getAll(req.query);
    res.json({ success: true, data: result.items, total: result.total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNewsItem = async (req, res) => {
  try {
    const item = await newsService.getById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createNews = async (req, res) => {
  try {
    const item = await newsService.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const item = await newsService.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    await newsService.remove(req.params.id);
    res.json({ success: true, message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getNews,
  getNewsItem,
  createNews,
  updateNews,
  deleteNews,
};
