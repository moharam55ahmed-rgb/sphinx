
const prisma = require('../config/prisma');

exports.getHomeData = async () => {
  const sections = await prisma.pageSection.findMany({
    where: { page: { slug: 'home' }, isActive: true },
    orderBy: { sortOrder: 'asc' }
  });
  return sections;
};

exports.getPageBySlug = async (slug) => {
  return await prisma.page.findFirst({
    where: { slug, status: 'published' },
    include: { sections: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } }
  });
};

exports.getProjects = async (query = {}) => {
  const { categoryId, isFeatured, limit } = query;
  let where = { status: 'published' };
  if (categoryId) where.categoryId = categoryId;
  if (isFeatured === 'true') where.isFeatured = true;

  return await prisma.project.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: { category: true },
    take: limit ? parseInt(limit) : undefined,
  });
};

exports.getProjectBySlug = async (slug) => {
  return await prisma.project.findFirst({
    where: { slug, status: 'published' },
    include: { category: true }
  });
};

exports.getCategories = async () => {
  return await prisma.projectCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });
};

exports.getSettings = async () => {
  const settings = await prisma.websiteSetting.findMany();
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
};

exports.getNavigation = async (location) => {
  const loc = (location || 'header').toLowerCase();
  return await prisma.navigationItem.findMany({
    where: {
      isActive: true,
      OR: [{ location: loc }, { location: loc.toUpperCase() }],
    },
    orderBy: { sortOrder: 'asc' }
  });
};

const normalizeSeoSlug = (slug) => {
  if (!slug || slug === '/') return 'home';
  return slug.replace(/^\//, '');
};

exports.getSeoBySlug = async (slug) => {
  const normalized = normalizeSeoSlug(slug);
  return await prisma.seoMeta.findUnique({
    where: { slug: normalized }
  });
};

exports.getNews = async (query = {}) => {
  const { limit, category } =
    typeof query === 'object' && query !== null ? query : { limit: query };
  const where = { status: 'published' };
  if (category && category !== 'all') {
    where.category = category;
  }
  return await prisma.news.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: limit ? parseInt(limit, 10) : undefined,
  });
};

exports.getNewsBySlug = async (slug) => {
  return await prisma.news.findFirst({
    where: { slug, status: 'published' }
  });
};

exports.getNewsCategories = async () => {
  return prisma.newsCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
};

exports.getGalleryCategories = async () => {
  return prisma.galleryCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
};

exports.getGallery = async (type, categorySlug) => {
  const where = { showInGallery: true };
  if (type) {
    const t = type.toLowerCase();
    where.mimeType = { startsWith: t === 'video' ? 'video' : 'image' };
  }
  if (categorySlug && categorySlug !== 'all') {
    where.galleryCategory = { slug: categorySlug, isActive: true };
  }
  return prisma.media.findMany({
    where,
    include: { galleryCategory: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.submitContact = async (data) => {
  const { name, email, phone, subject, message } = data;
  if (!name || !email || !message) {
    const err = new Error('Name, email, and message are required');
    err.statusCode = 400;
    throw err;
  }
  return await prisma.contactMessage.create({
    data: {
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : null,
      subject: subject ? String(subject) : null,
      message: String(message),
      status: 'unread',
    },
  });
};
