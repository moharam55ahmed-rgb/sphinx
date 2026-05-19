
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.page.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.page.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.page.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.page.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.page.delete({ where: { id } });
};
