const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactMessages.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.getAll);
router.get('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.getById);
router.post('/', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.create);
router.patch('/:id/status', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.updateStatus);
router.put('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.remove);

module.exports = router;