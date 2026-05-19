
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.projectCategory.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.projectCategory.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.projectCategory.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.projectCategory.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.projectCategory.delete({ where: { id } });
};
