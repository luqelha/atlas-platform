import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/database/prisma.service';
import { createTestApp, clearDatabase, setupTestUserAndTenant } from './test-utils';

describe('CMS Module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tenantToken: string;
  let tenantId: string;
  let authorId: string;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await clearDatabase(prisma);
    const setup = await setupTestUserAndTenant(app, 'ADMIN');
    tenantToken = setup.token;
    tenantId = setup.tenant.id;
    authorId = setup.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Category', () => {
    let categoryId: string;

    it('/categories (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .send({
          name: 'News',
          slug: 'news',
          description: 'Latest news',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('News');
      categoryId = response.body.id;
    });

    it('/categories (GET)', async () => {
      // Create first
      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .send({ name: 'Tech', slug: 'tech' });

      const response = await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toBe('Tech');
    });

    it('/categories/:id (PATCH)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .send({ name: 'Old Name', slug: 'old-name' });

      const id = createRes.body.id;

      const updateRes = await request(app.getHttpServer())
        .patch(`/categories/${id}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .send({ name: 'New Name' })
        .expect(200);

      expect(updateRes.body.name).toBe('New Name');
    });

    it('/categories/:id (DELETE)', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .send({ name: 'To Delete', slug: 'to-delete' });

      const id = createRes.body.id;

      await request(app.getHttpServer())
        .delete(`/categories/${id}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .expect(200);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/categories/${id}`)
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .expect(404);
    });
  });

  describe('Content', () => {
    let contentId: string;

    it('/contents (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/contents')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .send({
          title: 'Hello World',
          slug: 'hello-world',
          body: 'This is a test post',
          status: 'DRAFT',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Hello World');
      contentId = response.body.id;
    });

    it('/contents (GET)', async () => {
      await request(app.getHttpServer())
        .post('/contents')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .send({
          title: 'Another Post',
          slug: 'another-post',
          body: 'Content here',
        });

      const response = await request(app.getHttpServer())
        .get('/contents')
        .set('Authorization', `Bearer ${tenantToken}`)
        .set('x-tenant-id', tenantId)
        .expect(200);

      // Depending on pagination setup in ContentService, this might be an object or array.
      // Usually { data, total, page, limit }
      const data = response.body.data || response.body;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
