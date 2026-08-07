import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/database/prisma.service';
import { CategoryService } from '../../src/modules/cms/services/category.service';
import {
  createIntegrationTestModule,
  clearDatabase,
  setupTestTenantAndUser,
} from './int-test-utils';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoryService (Integration)', () => {
  let moduleRef: TestingModule;
  let categoryService: CategoryService;
  let prisma: PrismaService;
  let tenantId: string;

  beforeAll(async () => {
    moduleRef = await createIntegrationTestModule();
    categoryService = moduleRef.get<CategoryService>(CategoryService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    const setup = await setupTestTenantAndUser(prisma);
    tenantId = setup.tenant.id;
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const category = await categoryService.create(tenantId, {
        name: 'Tech',
        slug: 'tech',
        description: 'Technology news',
      });

      expect(category).toBeDefined();
      expect(category.id).toBeDefined();
      expect(category.name).toBe('Tech');
      expect(category.tenantId).toBe(tenantId);
    });

    it('should throw ConflictException if slug already exists in tenant', async () => {
      await categoryService.create(tenantId, {
        name: 'Tech',
        slug: 'tech',
      });

      await expect(
        categoryService.create(tenantId, {
          name: 'Another Tech',
          slug: 'tech',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories for a tenant', async () => {
      await categoryService.create(tenantId, { name: 'A', slug: 'a' });
      await categoryService.create(tenantId, { name: 'B', slug: 'b' });

      const categories = await categoryService.findAll(tenantId);
      expect(categories).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const created = await categoryService.create(tenantId, { name: 'A', slug: 'a' });
      const found = await categoryService.findOne(created.id, tenantId);

      expect(found.id).toBe(created.id);
      expect(found.name).toBe('A');
    });

    it('should throw NotFoundException if category does not belong to tenant', async () => {
      const created = await categoryService.create(tenantId, { name: 'A', slug: 'a' });

      const otherSetup = await setupTestTenantAndUser(prisma);

      await expect(categoryService.findOne(created.id, otherSetup.tenant.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const created = await categoryService.create(tenantId, { name: 'Old', slug: 'old' });
      const updated = await categoryService.update(created.id, tenantId, { name: 'New' });

      expect(updated.name).toBe('New');
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const created = await categoryService.create(tenantId, {
        name: 'To Delete',
        slug: 'to-delete',
      });
      await categoryService.remove(created.id, tenantId);

      await expect(categoryService.findOne(created.id, tenantId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
