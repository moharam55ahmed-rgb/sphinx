const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/prisma');

const startServer = async () => {
  try {
    // Test Database Connection
    await prisma.$connect();
    console.log('Database connected successfully.');

    if (!prisma.pageVisit) {
      console.error(
        '\n[SPHINX] PageVisit model missing. Run: npx prisma generate\nThen restart this server.\n'
      );
    }

    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port} in ${env.nodeEnv} mode`);
      console.log(`Swagger Docs available at http://localhost:${env.port}/api/docs`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
