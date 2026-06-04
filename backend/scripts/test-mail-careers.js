/**
 * Simulate a careers application email (with optional CV PDF).
 * Usage: node scripts/test-mail-careers.js [path/to/cv.pdf]
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mail = require('../src/services/mail.service');
const env = require('../src/config/env');

async function main() {
  const cvArg = process.argv[2];
  let cvFile = null;

  if (cvArg) {
    const absolute = path.resolve(cvArg);
    if (!fs.existsSync(absolute)) {
      console.error('CV file not found:', absolute);
      process.exit(1);
    }
    cvFile = {
      path: absolute,
      originalname: path.basename(absolute),
      mimetype: 'application/pdf',
      size: fs.statSync(absolute).size,
    };
  } else {
    const samplePath = path.resolve('uploads', 'test-cv-sample.pdf');
    fs.mkdirSync(path.dirname(samplePath), { recursive: true });
    if (!fs.existsSync(samplePath)) {
      fs.writeFileSync(samplePath, '%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n');
    }
    cvFile = {
      path: samplePath,
      originalname: 'test-cv-sample.pdf',
      mimetype: 'application/pdf',
      size: fs.statSync(samplePath).size,
    };
    console.log('Using sample CV:', samplePath);
  }

  const result = await mail.sendCareersNotification(
    {
      name: 'Test Applicant',
      email: 'applicant@example.com',
      phone: '+20 100 000 0000',
      position: 'Technical Sales Engineer',
      message: 'Test careers email with CV attachment',
    },
    cvFile
  );
  console.log('Careers notify target:', env.mail.careersTo);
  console.log('CV:', cvFile.originalname, `(${cvFile.size} bytes)`);
  console.log('Result:', result);
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
