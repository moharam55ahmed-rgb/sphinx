
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

exports.getAll = async (query = {}) => {
  return await prisma.user.findMany({ where: query, select: userSelect });
};

exports.getById = async (id) => {
  return await prisma.user.findUnique({ where: { id }, select: userSelect });
};

exports.create = async (data) => {
  const payload = { ...data };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  const user = await prisma.user.create({ data: payload, select: userSelect });
  return user;
};

exports.update = async (id, data) => {
  const payload = { ...data };
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  } else {
    delete payload.password;
  }
  return await prisma.user.update({
    where: { id },
    data: payload,
    select: userSelect,
  });
};

exports.remove = async (id) => {
  return await prisma.user.delete({ where: { id }, select: userSelect });
};
