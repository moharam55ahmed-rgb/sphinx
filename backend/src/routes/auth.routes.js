const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);
router.post('/change-password', authenticate, controller.changePassword);

module.exports = router;