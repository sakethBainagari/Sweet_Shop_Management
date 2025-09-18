// Set test environment to prevent server from starting
process.env.NODE_ENV = 'test';

import { prisma } from '../index';

beforeAll(async () => {
  // Database connection is handled by the imported prisma instance
});

afterAll(async () => {
  // Database disconnection is handled by the imported prisma instance
});

afterEach(async () => {
  // Clean up database after each test
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }: { tablename: string }) => tablename)
    .filter((name: string) => name !== '_prisma_migrations')
    .map((name: string) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
});