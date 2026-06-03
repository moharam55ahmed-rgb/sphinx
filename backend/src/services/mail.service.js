const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;

function getTransporter() {
  if (transporter !== undefined) return transporter;
  if (!env.mail.smtpHost) {
    transporter = null;
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.mail.smtpHost,
    port: env.mail.smtpPort,
    secure: env.mail.smtpSecure,
    auth:
      env.mail.smtpUser && env.mail.smtpPass
        ? { user: env.mail.smtpUser, pass: env.mail.smtpPass }
        : undefined,
  });
  return transporter;
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendNotification({ subject, html, text, attachments = [] }) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(
      '[mail] SMTP not configured — message saved in admin only. Set SMTP_HOST in backend/.env'
    );
    return { sent: false, reason: 'smtp_not_configured' };
  }

  await transport.sendMail({
    from: env.mail.from,
    to: env.mail.notifyTo,
    replyTo: env.mail.replyTo,
    subject,
    html,
    text,
    attachments,
  });

  return { sent: true, to: env.mail.notifyTo };
}

exports.sendContactNotification = async (payload) => {
  const { name, email, phone, subject, message } = payload;
  const title = subject || 'Contact form';
  const html = `
    <h2>${esc(title)}</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
    ${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ''}
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${esc(message)}</pre>
  `;
  const text = `${title}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\n${message}`;

  return sendNotification({
    subject: `[City Sphinx] ${title}`,
    html,
    text,
  });
};

exports.sendCareersNotification = async (payload, cvFile) => {
  const { name, email, phone, position, message } = payload;
  const html = `
    <h2>Careers application</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
    ${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ''}
    <p><strong>Position:</strong> ${esc(position || '—')}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${esc(message || '—')}</pre>
  `;
  const text = `Careers application\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nPosition: ${position || '-'}\n\n${message || ''}`;

  const attachments = [];
  if (cvFile?.path) {
    attachments.push({
      filename: cvFile.originalname || 'cv.pdf',
      path: cvFile.path,
    });
  }

  return sendNotification({
    subject: `[City Sphinx] Careers: ${position || name}`,
    html,
    text,
    attachments,
  });
};
