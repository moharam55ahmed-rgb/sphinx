const express = require('express');
const router = express.Router();
const controller = require('../controllers/media.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { upload } = require('../middlewares/upload.middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/upload', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), upload.single('file'), controller.uploadFile);
router.post('/', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.create);
router.put('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.remove);

module.exports = router;