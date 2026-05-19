
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.navigationItem.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.navigationItem.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.navigationItem.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.navigationItem.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.navigationItem.delete({ where: { id } });
};
