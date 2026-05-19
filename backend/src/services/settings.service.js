
const prisma = require('../config/prisma');

exports.getAll = async (query = {}) => {
  return await prisma.websiteSetting.findMany({ where: query });
};

exports.getById = async (id) => {
  return await prisma.websiteSetting.findUnique({ where: { id } });
};

exports.getByKey = async (key) => {
  return await prisma.websiteSetting.findUnique({ where: { key } });
};

exports.create = async (data) => {
  return await prisma.websiteSetting.create({ data });
};

exports.upsertByKey = async (key, data) => {
  return await prisma.websiteSetting.upsert({
    where: { key },
    update: {
      value: data.value,
      group: data.group || undefined,
    },
    create: {
      key,
      group: data.group || 'general',
      value: data.value ?? {},
    },
  });
};

exports.update = async (idOrKey, data) => {
  const existing = await prisma.websiteSetting.findFirst({
    where: {
      OR: [{ id: idOrKey }, { key: idOrKey }],
    },
  });

  if (!existing) {
    return exports.upsertByKey(data.key || idOrKey, data);
  }

  return await prisma.websiteSetting.update({
    where: { id: existing.id },
    data: {
      value: data.value !== undefined ? data.value : existing.value,
      group: data.group !== undefined ? data.group : existing.group,
    },
  });
};

exports.remove = async (id) => {
  return await prisma.websiteSetting.delete({ where: { id } });
};
