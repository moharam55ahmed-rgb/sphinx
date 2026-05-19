
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.contactMessage.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.contactMessage.findUnique({ where: { id } });
};

exports.create = async (data) => {
  return await prisma.contactMessage.create({ data });
};

exports.update = async (id, data) => {
  return await prisma.contactMessage.update({ where: { id }, data });
};

exports.updateStatus = async (id, status) => {
  const allowed = ['unread', 'read', 'archived'];
  if (!allowed.includes(status)) {
    const err = new Error('Invalid status');
    err.statusCode = 400;
    throw err;
  }
  return await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
};

exports.remove = async (id) => {
  return await prisma.contactMessage.delete({ where: { id } });
};
