import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/database/prisma.service';
import { CmsModule } from '../../src/modules/cms/cms.module';
import { DatabaseModule } from '../../src/database/database.module';

export async function createIntegrationTestModule(): Promise<TestingModule> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [DatabaseModule, CmsModule],
  }).compile();

  return moduleFixture;
}

export async function clearDatabase(prisma: PrismaService) {
  const tableNames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    if (tables.length > 0) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    console.log({ error });
  }
}

export async function setupTestTenantAndUser(prisma: PrismaService) {
  const user = await prisma.user.create({
    data: {
      email: `int-test-${Date.now()}@example.com`,
      passwordHash: 'dummyhash',
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      name: `Int Tenant ${Date.now()}`,
      domain: `int-test-${Date.now()}.example.com`,
    },
  });

  return { user, tenant };
}
