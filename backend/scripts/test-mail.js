/**
 * Send a one-off SMTP test email.
 * Usage: node scripts/test-mail.js [recipient@email.com]
 */
require('dotenv').config();
const nodemailer = require('nodemailer');
const env = require('../src/config/env');

const to = process.argv[2] || 'mahmoudakram422@gmail.com';

async function main() {
  const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass, from } = env.mail;

  if (!smtpHost) {
    console.error('SMTP_HOST is not set in backend/.env');
    process.exit(1);
  }

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  });

  console.log('Verifying SMTP connection...');
  await transport.verify();
  console.log('SMTP OK');

  const fromAddress = smtpUser?.includes('@')
    ? `City Sphinx <${smtpUser}>`
    : from;

  const info = await transport.sendMail({
    from: fromAddress,
    to,
    subject: '[City Sphinx] SMTP test',
    text: `Test email from City Sphinx backend at ${new Date().toISOString()}`,
    html: `<p>SMTP test from <strong>City Sphinx</strong> backend.</p><p>Sent at ${new Date().toISOString()}</p>`,
  });

  console.log('Sent:', info.messageId);
  console.log('To:', to);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
