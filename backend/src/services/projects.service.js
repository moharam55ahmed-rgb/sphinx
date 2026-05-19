
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.project.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.project.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.project.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.project.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.project.delete({ where: { id } });
};
