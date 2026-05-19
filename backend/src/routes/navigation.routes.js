const express = require('express');
const router = express.Router();
const controller = require('../controllers/navigation.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.create);
router.put('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.remove);

module.exports = router;