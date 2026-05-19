
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return prisma.galleryCategory.findMany({
    where: query,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });
};

exports.getById = async (id) => {
  return prisma.galleryCategory.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return prisma.galleryCategory.create({ data });
};

exports.update = async (id, data) => {
  return prisma.galleryCategory.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return prisma.galleryCategory.delete({ where: { id } });
};
