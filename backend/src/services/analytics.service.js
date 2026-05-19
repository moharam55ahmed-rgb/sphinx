const prisma = require('../config/prisma');

function assertPageVisitModel() {
  if (!prisma.pageVisit) {
    const err = new Error(
      'Visit analytics not ready. Run: cd backend && npx prisma generate && npm run dev'
    );
    err.statusCode = 503;
    throw err;
  }
}

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

exports.recordVisit = async ({ path, locale, referrer }) => {
  assertPageVisitModel();
  const cleanPath = String(path || '/').slice(0, 500);
  if (cleanPath.includes('/admin') || cleanPath.includes('/api')) {
    return null;
  }

  return prisma.pageVisit.create({
    data: {
      path: cleanPath,
      locale: String(locale || 'en').slice(0, 10),
      referrer: referrer ? String(referrer).slice(0, 500) : null,
    },
  });
};

exports.getStats = async () => {
  assertPageVisitModel();
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [total, today, last7Days, last30Days, topPages] = await Promise.all([
    prisma.pageVisit.count(),
    prisma.pageVisit.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.pageVisit.groupBy({
      by: ['path'],
      where: { createdAt: { gte: monthAgo } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
  ]);

  const dailyVisits = [];
  for (let i = 6; i >= 0; i -= 1) {
    const dayStart = startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const count = await prisma.pageVisit.count({
      where: {
        createdAt: { gte: dayStart, lt: dayEnd },
      },
    });
    dailyVisits.push({
      date: dayStart.toISOString().slice(0, 10),
      count,
    });
  }

  return {
    total,
    today,
    last7Days,
    last30Days,
    topPages: topPages.map((row) => ({
      path: row.path,
      count: row._count.path,
    })),
    dailyVisits,
  };
};
