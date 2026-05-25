/**
 * CORS_ORIGIN:
 *   *  (default) — allow any origin (echoes request Origin header)
 *   https://citysphinx.com,https://sphinx-bay.vercel.app — comma-separated allowlist
 *   single URL — one origin only
 */
function getCorsOptions() {
  const raw = (process.env.CORS_ORIGIN ?? '*').trim();

  if (raw === '*') {
    return {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  const allowed = raw.split(',').map((s) => s.trim()).filter(Boolean);

  if (allowed.length === 1) {
    return {
      origin: allowed[0],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  return {
    origin(origin, callback) {
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

module.exports = { getCorsOptions };
