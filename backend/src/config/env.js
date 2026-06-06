require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  mail: {
    notifyTo: process.env.NOTIFY_EMAIL || 'info@citysphinx.com',
    contactTo:
      process.env.CONTACT_NOTIFY_EMAIL ||
      process.env.NOTIFY_EMAIL ||
      'info@citysphinx.com',
    careersTo:
      process.env.CAREERS_NOTIFY_EMAIL ||
      process.env.NOTIFY_EMAIL ||
      'info@citysphinx.com',
    from: process.env.MAIL_FROM || 'City Sphinx <noreply@citysphinx.com>',
    replyTo: process.env.MAIL_REPLY_TO || 'info@citysphinx.com',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
  },
};
