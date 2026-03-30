import '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import { ExpressAdapter } from '@nestjs/platform-express';

interface TaskResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  user_id: number;
}

interface ErrorResponse {
  errors: string;
}

describe('TaskController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;
  let accessToken: string;
  let otherAccessToken: string;
  let taskId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication(new ExpressAdapter());
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);

    await testService.deleteUser();
    await testService.createUser();
    const loginBody = (
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'test123' })
    ).body as { access_token: string };
    accessToken = loginBody.access_token;

    await testService.deleteOtherUser();
    await testService.createOtherUser();
    const otherLoginBody = (
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'other@example.com', password: 'test123' })
    ).body as { access_token: string };
    otherAccessToken = otherLoginBody.access_token;
  });

  afterAll(async () => {
    await testService.deleteTask();
    await testService.deleteUser();
    await testService.deleteOtherUser();
    await app.close();
  });

  describe('POST /api/tasks', () => {
    beforeEach(async () => {
      await testService.deleteTask();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: '', priority: 'urgent' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be rejected if no token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .send({ title: 'test', description: 'test', priority: 'low' });

      logger.info(response.body);

      expect(response.status).toBe(401);
    });

    it('should be able to create task without due_date', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test task',
          description: 'test description',
          priority: 'high',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      const body = response.body as TaskResponse;
      expect(body.title).toBe('test task');
      expect(body.description).toBe('test description');
      expect(body.priority).toBe('high');
      expect(body.status).toBe('todo');
      expect(body.due_date).toBeDefined();

      taskId = body.id;
    });

    it('should be able to create task with due_date', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'test task with date',
          description: 'test description',
          priority: 'low',
          due_date: '2026-12-01T00:00:00.000Z',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect((response.body as TaskResponse).due_date).toBe(
        '2026-12-01T00:00:00.000Z',
      );
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await testService.deleteTask();
      await testService.createTask();
    });

    it('should be rejected if no token', async () => {
      const response = await request(app.getHttpServer()).get('/api/tasks');

      logger.info(response.body);

      expect(response.status).toBe(401);
    });

    it('should be able to get all tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tasks')
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      const body = response.body as TaskResponse[];
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0].title).toBe('test task');
    });
  });

  describe('GET /api/tasks/:id', () => {
    beforeEach(async () => {
      await testService.deleteTask();
      const task = await testService.createTask();
      taskId = task.id;
    });

    it('should be rejected if no token', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/tasks/${taskId}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
    });

    it('should be rejected if task not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/tasks/999999')
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be rejected if task belongs to other user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherAccessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(403);
    });

    it('should be able to get task by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      const body = response.body as TaskResponse;
      expect(body.id).toBe(taskId);
      expect(body.title).toBe('test task');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    beforeEach(async () => {
      await testService.deleteTask();
      const task = await testService.createTask();
      taskId = task.id;
    });

    it('should be rejected if no token', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}`)
        .send({ title: 'updated', description: 'updated', priority: 'low' });

      logger.info(response.body);

      expect(response.status).toBe(401);
    });

    it('should be rejected if task not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/tasks/999999')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'updated', description: 'updated', priority: 'low' });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be rejected if task belongs to other user', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherAccessToken}`)
        .send({ title: 'hacked', description: 'hacked', priority: 'low' });

      logger.info(response.body);

      expect(response.status).toBe(403);
    });

    it('should be able to update task', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'updated task',
          description: 'updated description',
          priority: 'medium',
          due_date: '2026-11-01T00:00:00.000Z',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      const body = response.body as TaskResponse;
      expect(body.title).toBe('updated task');
      expect(body.priority).toBe('medium');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    beforeEach(async () => {
      await testService.deleteTask();
      const task = await testService.createTask();
      taskId = task.id;
    });

    it('should be rejected if no token', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/api/tasks/${taskId}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
    });

    it('should be rejected if task not found', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/tasks/999999')
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be rejected if task belongs to other user', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${otherAccessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(403);
    });

    it('should be able to delete task', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
    });

    it('should be rejected after task deleted', async () => {
      await request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const response = await request(app.getHttpServer())
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });
  });
});
