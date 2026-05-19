const express = require('express');
const router = express.Router();
const controller = require('../controllers/public.controller');

router.get('/home', controller.getHomeData);
router.get('/pages/:slug', controller.getPageBySlug);
router.get('/projects', controller.getProjects);
router.get('/projects/:slug', controller.getProjectBySlug);
router.get('/project-categories', controller.getCategories);
router.get('/settings', controller.getSettings);
router.get('/navigation/:location', controller.getNavigation);
router.get('/seo/:slug', controller.getSeoBySlug);
router.get('/news', controller.getNews);
router.get('/news/:slug', controller.getNewsBySlug);
router.get('/news-categories', controller.getNewsCategories);
router.get('/gallery-categories', controller.getGalleryCategories);
router.get('/gallery', controller.getGallery);
router.post('/contact', controller.submitContact);
router.post('/analytics/visit', controller.recordVisit);

module.exports = router;
