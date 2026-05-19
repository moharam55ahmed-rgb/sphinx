const jwt = require('jsonwebtoken');
const env = require('../config/env');

const prisma = require('../config/prisma');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwt.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, status: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'User account is disabled' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { authenticate };
