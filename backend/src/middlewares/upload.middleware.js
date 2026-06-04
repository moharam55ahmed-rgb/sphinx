const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = crypto.randomBytes(8).toString('hex') + '-' + Date.now();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const CV_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/youtube',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type for upload.'));
  }
};

/** Careers CV — allow PDF/DOC by extension (browsers often send application/octet-stream) */
const careersCvFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const okMime = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
    'binary/octet-stream',
  ].includes(file.mimetype);

  if (CV_EXTENSIONS.has(ext) && (okMime || file.mimetype === '')) {
    cb(null, true);
    return;
  }
  cb(new Error('CV must be a PDF, DOC, or DOCX file (max 10MB).'));
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter,
});

const careersUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: careersCvFilter,
});

module.exports = { upload, careersUpload };
