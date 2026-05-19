const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'User', lower: 'users' },
  { name: 'Page', lower: 'pages' },
  { name: 'PageSection', lower: 'sections' },
  { name: 'Project', lower: 'projects' },
  { name: 'ProjectCategory', lower: 'projectCategories' },
  { name: 'Media', lower: 'media' },
  { name: 'WebsiteSetting', lower: 'settings' },
  { name: 'SeoMeta', lower: 'seo' },
  { name: 'Redirect', lower: 'redirects' },
  { name: 'NavigationItem', lower: 'navigation' },
  { name: 'ContactMessage', lower: 'contactMessages' },
];

const dirs = ['routes', 'controllers', 'services'];
dirs.forEach(d => {
  const p = path.join(__dirname, 'src', d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

for (const entity of entities) {
  // Service
  const serviceCode = `const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (query = {}) => {
  return await prisma.${entity.name.toLowerCase()}.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.${entity.name.toLowerCase()}.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.${entity.name.toLowerCase()}.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.${entity.name.toLowerCase()}.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.${entity.name.toLowerCase()}.delete({ where: { id } });
};
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'services', entity.lower + '.service.js'), serviceCode.trim());

  // Controller
  const controllerCode = `const service = require('../services/${entity.lower}.service');

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
`;
  
  fs.writeFileSync(path.join(__dirname, 'src', 'controllers', entity.lower + '.controller.js'), controllerCode.trim());

  // Route
  const routeCode = `const express = require('express');
const router = express.Router();
const controller = require('../controllers/${entity.lower}.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.create);
router.put('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('CONTENT_MANAGER', 'SUPER_ADMIN'), controller.remove);

module.exports = router;
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'routes', entity.lower + '.routes.js'), routeCode.trim());
}

// Auth specific files
const authServiceCode = `const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = new PrismaClient();

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== 'ACTIVE') throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ id: user.id }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) throw new Error('Invalid old password');
  
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hash } });
};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'services', 'auth.service.js'), authServiceCode.trim());

const authControllerCode = `const service = require('../services/auth.service');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await service.login(email, password);
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === 'Invalid credentials') return res.status(401).json({ success: false, message: err.message });
    next(err);
  }
};

exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.me = (req, res) => {
  res.json({ success: true, data: req.user });
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await service.changePassword(req.user.id, oldPassword, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'controllers', 'auth.controller.js'), authControllerCode.trim());

const authRouteCode = `const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);
router.post('/change-password', authenticate, controller.changePassword);

module.exports = router;
`;
fs.writeFileSync(path.join(__dirname, 'src', 'routes', 'auth.routes.js'), authRouteCode.trim());

console.log('Generated boilerplate files.');
