const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== 'ACTIVE') throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ id: user.id }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) throw new Error('Invalid old password');
  
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hash } });
};
