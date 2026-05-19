
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.pageSection.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.pageSection.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.pageSection.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.pageSection.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.pageSection.delete({ where: { id } });
};
