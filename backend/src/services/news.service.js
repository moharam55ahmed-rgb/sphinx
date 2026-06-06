const prisma = require('../config/prisma');

const getAll = async (query = {}) => {
  const { status, category, limit = 10, page = 1 } = query;
  const where = {};
  if (status) where.status = status;
  if (category && category !== 'all') where.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: parseInt(limit),
      skip,
    }),
    prisma.news.count({ where }),
  ]);

  return { items, total, page: parseInt(page), limit: parseInt(limit) };
};

const getById = async (id) => {
  return await prisma.news.findUnique({ where: { id } });
};

const getBySlug = async (slug) => {
  return await prisma.news.findUnique({ where: { slug } });
};

const normalizePublishedAt = (value) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const str = String(value).trim();
  if (!str) return undefined;
  if (str.includes('T')) return new Date(str);
  return new Date(`${str}T00:00:00.000Z`);
};

const prepareNewsData = (data) => {
  const prepared = { ...data };
  if ('publishedAt' in prepared) {
    prepared.publishedAt = normalizePublishedAt(prepared.publishedAt);
  }
  return prepared;
};

const create = async (data) => {
  return await prisma.news.create({ data: prepareNewsData(data) });
};

const update = async (id, data) => {
  return await prisma.news.update({ where: { id }, data: prepareNewsData(data) });
};

const remove = async (id) => {
  return await prisma.news.delete({ where: { id } });
};

module.exports = {
  getAll,
  getById,
  getBySlug,
  create,
  update,
  remove,
};
