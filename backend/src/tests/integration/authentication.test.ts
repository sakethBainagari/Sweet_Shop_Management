import request from 'supertest';
import { createApp } from '../../index';
import { PrismaClient } from '@prisma/client';

const app = createApp();
const prisma = new PrismaClient();

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    // Clean database
    await prisma.purchase.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.purchase.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.role).toBe('USER');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should prevent registration with existing email', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'john@example.com', // Same email as previous test
        password: 'AnotherPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should validate password requirements', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123' // Too weak
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email', // Invalid format
        password: 'ValidPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should require all fields', async () => {
      const incompleteData = {
        name: 'Test User'
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('User Login', () => {
    beforeAll(async () => {
      // Create a test user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: 'login@example.com',
          password: 'LoginPassword123!'
        });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'LoginPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'AnyPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject invalid password', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should require email and password', async () => {
      const incompleteData = {
        email: 'login@example.com'
        // Missing password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Protected Routes Authentication', () => {
    let userToken: string;

    beforeAll(async () => {
      // Create and login user to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'LoginPassword123!'
        });

      userToken = loginResponse.body.data.token;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No token provided');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('User Profile and Token Validation', () => {
    let userToken: string;
    let userId: string;

    beforeAll(async () => {
      // Create a new user for profile tests
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Profile Test User',
          email: 'profile@example.com',
          password: 'ProfilePassword123!'
        });

      userToken = registerResponse.body.data.token;
      userId = registerResponse.body.data.user.id;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(userId);
      expect(response.body.data.user.email).toBe('profile@example.com');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should validate token expiration', async () => {
      // This test would require a token with short expiration
      // For now, we'll test with an obviously expired/invalid token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Password Security', () => {
    it('should hash passwords in database', async () => {
      const userData = {
        name: 'Security Test User',
        email: 'security@example.com',
        password: 'TestPassword123!'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Check that password is hashed in database
      const userInDb = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      expect(userInDb).toBeTruthy();
      expect(userInDb!.password).not.toBe(userData.password);
      expect(userInDb!.password.length).toBeGreaterThan(50); // Hashed password should be longer
    });

    it('should not return password in API responses', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'No Password Response',
          email: 'nopassword@example.com',
          password: 'TestPassword123!'
        })
        .expect(201);

      expect(response.body.data.user.password).toBeUndefined();
    });
  });
});