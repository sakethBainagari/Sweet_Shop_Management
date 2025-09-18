import request from 'supertest';
import { createApp, prisma } from '../index';

const app = createApp();

describe('Authentication System - TDD Implementation', () => {
  beforeAll(async () => {
    // Database connection is handled by the imported prisma instance
  });

  afterAll(async () => {
    // Database disconnection is handled by the imported prisma instance
  });

  afterEach(async () => {
    // Clean up database after each test
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.role).toBe('USER');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should hash password before storing in database', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      expect(user).toBeTruthy();
      expect(user!.password).not.toBe(userData.password);
      expect(user!.password.length).toBeGreaterThan(20); // bcrypt hash is longer
    });

    it('should return error for invalid email format', async () => {
      const userData = {
        name: 'Invalid Email',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Please provide a valid email address');
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should return error for password too short', async () => {
      const userData = {
        name: 'Short Password',
        email: 'short@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Password must be at least 8 characters long');
    });

    it('should return error for missing name', async () => {
      const userData = {
        email: 'noname@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Name is required');
    });

    it('should return error for empty name', async () => {
      const userData = {
        name: '',
        email: 'emptyname@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Name is required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = {
        name: 'Login Test User',
        email: 'login@example.com',
        password: 'testPassword123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
    });

    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'testPassword123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user.name).toBe('Login Test User');
      expect(response.body.data.user.role).toBe('USER');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return error for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('credentials');
    });

    it('should return error for wrong password', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('credentials');
    });

    it('should return error for missing email', async () => {
      const loginData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Email is required');
    });

    it('should return error for missing password', async () => {
      const loginData = {
        email: 'login@example.com'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toContain('Password is required');
    });
  });

  describe('JWT Token Validation', () => {
    it('should generate valid JWT token on registration', async () => {
      const userData = {
        name: 'JWT Test User',
        email: 'jwt@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');

      // Token should have 3 parts separated by dots
      const tokenParts = response.body.data.token.split('.');
      expect(tokenParts).toHaveLength(3);
    });

    it('should generate valid JWT token on login', async () => {
      // First register a user
      const userData = {
        name: 'JWT Login User',
        email: 'jwtlogin@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Then login
      const loginData = {
        email: 'jwtlogin@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');

      // Token should have 3 parts separated by dots
      const tokenParts = response.body.data.token.split('.');
      expect(tokenParts).toHaveLength(3);
    });
  });

  describe('Password Security', () => {
    it('should use bcrypt for password hashing with proper salt rounds', async () => {
      const userData = {
        name: 'Security Test',
        email: 'security@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      expect(user).toBeTruthy();
      // bcrypt hash starts with $2a$, $2b$, or $2y$
      expect(user!.password).toMatch(/^\$2[aby]\$.+/);
    });

    it('should not store plain text passwords', async () => {
      const userData = {
        name: 'Plain Text Test',
        email: 'plaintext@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      expect(user!.password).not.toBe(userData.password);
      expect(user!.password.length).toBeGreaterThan(userData.password.length);
    });
  });

  describe('Input Validation', () => {
    it('should trim whitespace from email', async () => {
      const userData = {
        name: 'Trim Test',
        email: '  trim@example.com  ',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.data.user.email).toBe('trim@example.com');
    });

    it('should trim whitespace from name', async () => {
      const userData = {
        name: '  Trim Name  ',
        email: 'trimname@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.data.user.name).toBe('Trim Name');
    });
  });

  describe('Error Response Format', () => {
    it('should return consistent error format', async () => {
      const userData = {
        name: 'Error Format Test',
        email: 'invalid-email',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });

    it('should not expose sensitive information in errors', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).not.toContain('database');
      expect(response.body.message).not.toContain('SQL');
      expect(response.body.message).toContain('credentials');
    });
  });
});