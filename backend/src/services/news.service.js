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

const create = async (data) => {
  return await prisma.news.create({ data });
};

const update = async (id, data) => {
  return await prisma.news.update({ where: { id }, data });
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
