
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.seoMeta.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.seoMeta.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.seoMeta.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.seoMeta.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.seoMeta.delete({ where: { id } });
};
