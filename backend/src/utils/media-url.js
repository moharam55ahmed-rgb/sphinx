/** Store uploads as paths only, not full URLs. */
function normalizeFileUrl(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return fileUrl;

  const trimmed = fileUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      return new URL(trimmed).pathname;
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

module.exports = { normalizeFileUrl };
