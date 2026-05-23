const prisma = require('../config/prisma');
const { normalizeFileUrl } = require('../utils/media-url');

exports.getAll = async (query = {}) => {
  return await prisma.media.findMany({
    where: query,
    include: { galleryCategory: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.getById = async (id) => {
  return await prisma.media.findUnique({ where: { id } });
};

exports.create = async (data) => {
  const payload = { ...data };
  if (payload.fileUrl) payload.fileUrl = normalizeFileUrl(payload.fileUrl);

  return await prisma.media.create({
    data: payload,
    include: { galleryCategory: true },
  });
};

exports.update = async (id, data) => {
  const payload = { ...data };
  if (payload.fileUrl) payload.fileUrl = normalizeFileUrl(payload.fileUrl);

  return await prisma.media.update({
    where: { id },
    data: payload,
    include: { galleryCategory: true },
  });
};

exports.remove = async (id) => {
  return await prisma.media.delete({ where: { id } });
};
