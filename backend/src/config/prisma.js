const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const env = require('./env');

function parseDatabaseUrl(dbUrl) {
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set. Check your backend/.env file.');
  }

  let parsed;
  try {
    parsed = new URL(dbUrl);
  } catch {
    throw new Error('DATABASE_URL is not a valid URL.');
  }

  const database = parsed.pathname.replace(/^\//, '').split('?')[0];
  if (!parsed.hostname || !database) {
    throw new Error('DATABASE_URL must include a host and database name.');
  }

  return {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database,
    connectionLimit: 10,
  };
}

const dbUrl = process.env.DATABASE_URL || env.databaseUrl;
const adapterOptions = parseDatabaseUrl(dbUrl);

const adapter = new PrismaMariaDb(adapterOptions);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
