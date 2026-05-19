
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return prisma.newsCategory.findMany({
    where: query,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
};

exports.getById = async (id) => {
  return prisma.newsCategory.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return prisma.newsCategory.create({ data });
};

exports.update = async (id, data) => {
  return prisma.newsCategory.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return prisma.newsCategory.delete({ where: { id } });
};
