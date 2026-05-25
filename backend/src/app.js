const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { allowAllCors } = require('./middlewares/cors.middleware');
const { errorMiddleware } = require('./middlewares/error.middleware');

const app = express();

// CORS first — allow all origins (*)
app.use(allowAllCors);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // increased for build workers
});
// app.use(limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Swagger Docs (will be mounted later)
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const pagesRoutes = require('./routes/pages.routes');
const sectionsRoutes = require('./routes/sections.routes');
const projectsRoutes = require('./routes/projects.routes');
const categoriesRoutes = require('./routes/projectCategories.routes');
const mediaRoutes = require('./routes/media.routes');
const settingsRoutes = require('./routes/settings.routes');
const seoRoutes = require('./routes/seo.routes');
const redirectsRoutes = require('./routes/redirects.routes');
const navigationRoutes = require('./routes/navigation.routes');
const contactRoutes = require('./routes/contactMessages.routes');
const newsRoutes = require('./routes/news.routes');
const newsCategoriesRoutes = require('./routes/newsCategories.routes');
const galleryCategoriesRoutes = require('./routes/galleryCategories.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const publicRoutes = require('./routes/public.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/project-categories', categoriesRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/redirects', redirectsRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/contact-messages', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/news-categories', newsCategoriesRoutes);
app.use('/api/gallery-categories', galleryCategoriesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/public', publicRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    cors: '*',
    timestamp: new Date().toISOString(),
  });
});

// Error Handling
app.use(errorMiddleware);

module.exports = app;
