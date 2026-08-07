import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/database/prisma.service';
import { ContentService } from '../../src/modules/cms/services/content.service';
import {
  createIntegrationTestModule,
  clearDatabase,
  setupTestTenantAndUser,
} from './int-test-utils';
import { NotFoundException } from '@nestjs/common';
import { ContentStatus } from '@prisma/client';

describe('ContentService (Integration)', () => {
  let moduleRef: TestingModule;
  let contentService: ContentService;
  let prisma: PrismaService;
  let tenantId: string;
  let authorId: string;

  beforeAll(async () => {
    moduleRef = await createIntegrationTestModule();
    contentService = moduleRef.get<ContentService>(ContentService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    const setup = await setupTestTenantAndUser(prisma);
    tenantId = setup.tenant.id;
    authorId = setup.user.id;
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('create', () => {
    it('should create content', async () => {
      const content = await contentService.create(tenantId, authorId, {
        title: 'Integration Post',
        slug: 'integration-post',
        body: 'Body text',
        status: 'DRAFT',
      });

      expect(content).toBeDefined();
      expect(content.id).toBeDefined();
      expect(content.title).toBe('Integration Post');
      expect(content.tenantId).toBe(tenantId);
      expect(content.authorId).toBe(authorId);
    });

    it('should set publishedAt when status is PUBLISHED', async () => {
      const content = await contentService.create(tenantId, authorId, {
        title: 'Published Post',
        slug: 'published-post',
        body: 'Body',
        status: 'PUBLISHED',
      });

      expect(content.status).toBe(ContentStatus.PUBLISHED);
      expect(content.publishedAt).toBeDefined();
      expect(content.publishedAt).not.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated contents for a tenant', async () => {
      await contentService.create(tenantId, authorId, { title: 'A', slug: 'a', body: 'A' });
      await contentService.create(tenantId, authorId, { title: 'B', slug: 'b', body: 'B' });

      const result = await contentService.findAll(tenantId, { take: 10, page: 1 } as any);

      expect(result.data).toHaveLength(2);
      expect(result.meta.itemCount).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should find one content', async () => {
      const created = await contentService.create(tenantId, authorId, {
        title: 'A',
        slug: 'a',
        body: 'A',
      });
      const found = await contentService.findOne(created.id, tenantId);

      expect(found.id).toBe(created.id);
    });
  });

  describe('update', () => {
    it('should update content title', async () => {
      const created = await contentService.create(tenantId, authorId, {
        title: 'Old',
        slug: 'old',
        body: 'Old',
      });
      const updated = await contentService.update(created.id, tenantId, { title: 'New' });

      expect(updated.title).toBe('New');
    });
  });

  describe('remove', () => {
    it('should delete content', async () => {
      const created = await contentService.create(tenantId, authorId, {
        title: 'To Delete',
        slug: 'delete',
        body: 'A',
      });
      await contentService.remove(created.id, tenantId);

      await expect(contentService.findOne(created.id, tenantId)).rejects.toThrow(NotFoundException);
    });
  });
});
