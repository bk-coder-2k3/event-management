import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/db';

const server = app.listen(env.PORT, () => {
  logger.info(`✨ VizhaSpace (vizhaspace.in) Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`🔗 API Prefix: ${env.API_PREFIX}`);
  logger.info(`🌐 Allowed Origin: ${env.CLIENT_ORIGIN}`);
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connections closed.');
    process.exit(0);
  });

  // Force shutdown after 10s if dangling connections
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
