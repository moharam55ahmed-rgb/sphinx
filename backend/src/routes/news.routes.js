const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use(authenticate);

router.route('/')
  .get(newsController.getNews)
  .post(authorize('SUPER_ADMIN', 'CONTENT_MANAGER'), newsController.createNews);

router.route('/:id')
  .get(newsController.getNewsItem)
  .put(authorize('SUPER_ADMIN', 'CONTENT_MANAGER'), newsController.updateNews)
  .delete(authorize('SUPER_ADMIN', 'CONTENT_MANAGER'), newsController.deleteNews);

module.exports = router;
