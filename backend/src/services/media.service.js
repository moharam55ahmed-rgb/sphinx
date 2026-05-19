
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.media.findMany({
    where: query,
    include: { galleryCategory: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.getById = async (id) => {
  return await prisma.media.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.media.create({
    data,
    include: { galleryCategory: true },
  });
};

exports.update = async (id, data) => {
  return await prisma.media.update({
    where: { id },
    data,
    include: { galleryCategory: true },
  });
};

exports.remove = async (id) => {
  return await prisma.media.delete({ where: { id } });
};
