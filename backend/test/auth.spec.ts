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

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  email?: string;
  name?: string;
  message?: string;
}

interface ErrorResponse {
  errors: string;
}

describe('AuthController', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication(new ExpressAdapter());
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ name: '', email: 'no-email', password: '123' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ name: 'test', email: 'test@example.com', password: 'test123' });

      logger.info(response.body);

      expect(response.status).toBe(201);
      const body = response.body as AuthResponse;
      expect(body.email).toBe('test@example.com');
      expect(body.name).toBe('test');
    });

    it('should be rejected if email already exists', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ name: 'test', email: 'test@example.com', password: 'test123' });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: '', password: '' });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be rejected if email not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nothing@example.com', password: 'test123' });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be rejected if password wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'salah123' });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'test123' });

      logger.info(response.body);

      expect(response.status).toBe(200);
      const body = response.body as AuthResponse;
      expect(body.access_token).toBeDefined();
      expect(body.refresh_token).toBeDefined();

      accessToken = body.access_token!;
      refreshToken = body.refresh_token!;
    });
  });

  describe('POST /api/auth/refresh', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();

      const loginBody = (
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'test123' })
      ).body as AuthResponse;

      accessToken = loginBody.access_token!;
      refreshToken = loginBody.refresh_token!;
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if refresh token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', 'Bearer falsetoken');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be able to refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      const body = response.body as AuthResponse;
      expect(body.access_token).toBeDefined();
      expect(body.refresh_token).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();

      const loginBody = (
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'test123' })
      ).body as AuthResponse;

      accessToken = loginBody.access_token!;
    });

    afterEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer falsetoken');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });

    it('should be able to logout', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect((response.body as AuthResponse).message).toBe('Logout Success');
    });

    it('should be rejected if token already blacklisted after logout', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect((response.body as ErrorResponse).errors).toBeDefined();
    });
  });
});
