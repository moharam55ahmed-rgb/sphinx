const express = require('express');
const router = express.Router();
const controller = require('../controllers/analytics.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get(
  '/stats',
  authenticate,
  authorize('SUPER_ADMIN', 'CONTENT_MANAGER', 'SEO_MARKETING'),
  controller.getStats
);

module.exports = router;
