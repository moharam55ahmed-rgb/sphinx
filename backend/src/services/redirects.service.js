
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.redirect.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.redirect.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.redirect.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.redirect.update({ where: { id }, data });
};

exports.remove = async (id) => {
  return await prisma.redirect.delete({ where: { id } });
};
