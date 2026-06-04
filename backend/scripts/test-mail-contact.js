/**
 * Simulate a contact form email to info@citysphinx.com
 * Usage: node scripts/test-mail-contact.js
 */
require('dotenv').config();
const mail = require('../src/services/mail.service');
const env = require('../src/config/env');

async function main() {
  const result = await mail.sendContactNotification({
    name: 'Test User',
    email: 'visitor@example.com',
    phone: '+20 100 000 0000',
    subject: 'New Request: Investment - City Hub Mall',
    message:
      'Request Type: Investment\nMall: City Hub Mall\nUnit: Commercial\n\nMessage: Test contact form from test-mail-contact.js',
  });
  console.log('Contact notify target:', env.mail.contactTo);
  console.log('Result:', result);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
