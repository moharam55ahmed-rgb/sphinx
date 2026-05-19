const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const env = require('./env');

const dbUrl = process.env.DATABASE_URL || env.databaseUrl;

// Basic parser for: mysql://user:pass@host:port/database
const urlPattern = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
const matches = dbUrl.match(urlPattern);

let adapterOptions;

if (matches) {
  const [, user, password, host, port, database] = matches;
  adapterOptions = {
    user,
    password,
    host,
    port: parseInt(port, 10),
    database,
    connectionLimit: 10
  };
} else {
  // Simple fallback for local dev if URL is just a string or different format
  adapterOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sphinx_db'
  };
}

const adapter = new PrismaMariaDb(adapterOptions);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
