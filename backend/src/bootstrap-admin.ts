import { prisma } from './config/db';
import { PasswordService } from './services/passwordService';
import { env } from './config/env';
import { logger } from './config/logger';

async function bootstrapAdmin() {
  const email = (process.env.ADMIN_EMAIL || env.DEFAULT_ADMIN_EMAIL).toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || env.DEFAULT_ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME || env.DEFAULT_ADMIN_NAME;

  logger.info({ email }, 'Initiating secure admin bootstrap...');

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (existingUser.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'ADMIN', status: 'ACTIVE' },
      });
      logger.info({ email }, 'Existing user elevated to ADMIN role successfully.');
    } else {
      logger.info({ email }, 'Admin user already exists and is active.');
    }
    return;
  }

  const passwordHash = await PasswordService.hash(password);

  const admin = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    },
  });

  logger.info(
    { adminId: admin.id, email: admin.email },
    '🎉 Admin user successfully bootstrapped via secure script!'
  );
}

bootstrapAdmin()
  .catch((err) => {
    logger.error({ err }, 'Failed to bootstrap admin');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
