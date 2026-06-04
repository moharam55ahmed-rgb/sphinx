const fs = require('fs');
const path = require('path');
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

/** cPanel SMTP usually requires From to match the authenticated mailbox */
function getFromAddress() {
  const user = env.mail.smtpUser?.trim();
  if (user && user.includes('@')) {
    return `City Sphinx <${user}>`;
  }
  return env.mail.from;
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendNotification({
  subject,
  html,
  text,
  attachments = [],
  to,
  replyTo,
}) {
  const transport = getTransporter();
  const recipient = to || env.mail.notifyTo;

  if (!transport) {
    console.warn(
      '[mail] SMTP not configured — message saved in admin only. Set SMTP_HOST in backend/.env'
    );
    return { sent: false, reason: 'smtp_not_configured', to: recipient };
  }

  await transport.sendMail({
    from: getFromAddress(),
    to: recipient,
    replyTo: replyTo || env.mail.replyTo,
    subject,
    html,
    text,
    attachments,
  });

  return { sent: true, to: recipient };
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
    to: env.mail.contactTo,
    replyTo: email,
  });
};

function buildCvAttachment(cvFile) {
  if (!cvFile?.path) return null;

  const absolutePath = path.isAbsolute(cvFile.path)
    ? cvFile.path
    : path.resolve(process.cwd(), cvFile.path);

  if (!fs.existsSync(absolutePath)) {
    console.error('[mail] CV file not found on disk:', absolutePath);
    return null;
  }

  return {
    filename: cvFile.originalname || path.basename(absolutePath) || 'cv.pdf',
    content: fs.readFileSync(absolutePath),
    contentType: cvFile.mimetype || 'application/pdf',
  };
}

exports.sendCareersNotification = async (payload, cvFile) => {
  const { name, email, phone, position, message } = payload;
  const cvAttachment = buildCvAttachment(cvFile);
  const cvLine = cvAttachment
    ? `<p><strong>CV:</strong> attached (${esc(cvAttachment.filename)})</p>`
    : cvFile?.originalname
      ? `<p><strong>CV:</strong> upload failed — ${esc(cvFile.originalname)} not attached</p>`
      : '';

  const html = `
    <h2>Careers application</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
    ${phone ? `<p><strong>Phone:</strong> ${esc(phone)}</p>` : ''}
    <p><strong>Position:</strong> ${esc(position || '—')}</p>
    ${cvLine}
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${esc(message || '—')}</pre>
  `;
  const text = `Careers application\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nPosition: ${position || '-'}\nCV: ${cvAttachment ? cvAttachment.filename : 'none'}\n\n${message || ''}`;

  const attachments = cvAttachment ? [cvAttachment] : [];

  return sendNotification({
    subject: `[City Sphinx] Careers: ${position || name}`,
    html,
    text,
    to: env.mail.careersTo,
    replyTo: email,
    attachments,
  });
};
