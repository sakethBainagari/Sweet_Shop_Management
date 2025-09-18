import request from 'supertest';
import { createApp } from '../../index';
import { PrismaClient } from '@prisma/client';

const app = createApp();
const prisma = new PrismaClient();

describe('Sweet Management Integration Tests', () => {
  let adminToken: string;
  let userToken: string;
  let testSweet: any;
  let testUser: any;
  let testAdmin: any;

  beforeAll(async () => {
    // Clean database
    await prisma.purchase.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create test admin
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'AdminPassword123!'
      });

    testAdmin = adminResponse.body.data.user;
    
    // Update user role to ADMIN
    await prisma.user.update({
      where: { email: 'admin@test.com' },
      data: { role: 'ADMIN' }
    });

    // Get admin token
    const adminLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'AdminPassword123!'
      });

    adminToken = adminLoginResponse.body.data.token;

    // Create test user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: 'UserPassword123!'
      });

    testUser = userResponse.body.data.user;
    userToken = userResponse.body.data.token;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.purchase.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('Sweet CRUD Operations', () => {
    it('should allow admin to create a sweet', async () => {
      const sweetData = {
        name: 'Test Chocolate Cake',
        category: 'Cakes',
        price: 25.99,
        quantity: 50,
        description: 'Delicious chocolate cake for testing'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sweetData.name);
      expect(response.body.data.category).toBe(sweetData.category);
      expect(response.body.data.price).toBe(sweetData.price);
      expect(response.body.data.quantity).toBe(sweetData.quantity);
      
      testSweet = response.body.data;
    });

    it('should prevent regular user from creating a sweet', async () => {
      const sweetData = {
        name: 'Unauthorized Sweet',
        category: 'Chocolates',
        price: 10.99,
        quantity: 20
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Admin access required');
    });

    it('should get all sweets (public endpoint)', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('price');
    });

    it('should get sweet by ID', async () => {
      const response = await request(app)
        .get(`/api/sweets/${testSweet.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testSweet.id);
      expect(response.body.data.name).toBe(testSweet.name);
    });

    it('should allow admin to update a sweet', async () => {
      const updateData = {
        name: 'Updated Chocolate Cake',
        price: 29.99,
        quantity: 60
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
      expect(response.body.data.quantity).toBe(updateData.quantity);
    });

    it('should prevent regular user from updating a sweet', async () => {
      const updateData = {
        name: 'Unauthorized Update',
        price: 999.99
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweet.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Purchase Flow Tests', () => {
    it('should allow authenticated user to purchase sweets', async () => {
      const purchaseData = {
        quantity: 3
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.purchase.quantity).toBe(3);
      expect(response.body.data.purchase.totalPrice).toBe(29.99 * 3);
      expect(response.body.data.updatedSweet.quantity).toBe(57); // 60 - 3
    });

    it('should prevent purchase with insufficient stock', async () => {
      const purchaseData = {
        quantity: 100 // More than available
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient stock');
    });

    it('should prevent purchase without authentication', async () => {
      const purchaseData = {
        quantity: 1
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweet.id}/purchase`)
        .send(purchaseData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should get user purchase history', async () => {
      const response = await request(app)
        .get('/api/purchases')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('sweet');
      expect(response.body.data[0]).toHaveProperty('quantity');
      expect(response.body.data[0]).toHaveProperty('totalPrice');
    });
  });

  describe('Admin Functions', () => {
    it('should allow admin to restock sweets', async () => {
      const restockData = {
        quantity: 25
      };

      const response = await request(app)
        .patch(`/api/sweets/${testSweet.id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(82); // 57 + 25
    });

    it('should prevent regular user from restocking', async () => {
      const restockData = {
        quantity: 10
      };

      const response = await request(app)
        .patch(`/api/sweets/${testSweet.id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(restockData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should allow admin to delete a sweet', async () => {
      // Create a sweet to delete
      const sweetToDelete = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Sweet to Delete',
          category: 'Test',
          price: 5.99,
          quantity: 10
        });

      const response = await request(app)
        .delete(`/api/sweets/${sweetToDelete.body.data.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify sweet is deleted
      const getResponse = await request(app)
        .get(`/api/sweets/${sweetToDelete.body.data.id}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });

    it('should get all purchases for admin', async () => {
      const response = await request(app)
        .get('/api/admin/purchases')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Search and Filter Tests', () => {
    beforeAll(async () => {
      // Create additional test sweets for search
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Vanilla Cupcake',
          category: 'Cupcakes',
          price: 3.99,
          quantity: 30
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Strawberry Tart',
          category: 'Tarts',
          price: 8.99,
          quantity: 15
        });
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=vanilla')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name.toLowerCase()).toContain('vanilla');
    });

    it('should filter sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Cupcakes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].category).toBe('Cupcakes');
    });

    it('should filter sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=5&maxPrice=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((sweet: any) => {
        expect(sweet.price).toBeGreaterThanOrEqual(5);
        expect(sweet.price).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle invalid sweet ID', async () => {
      const response = await request(app)
        .get('/api/sweets/invalid-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Missing required fields
          description: 'Incomplete sweet data'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });
  });
});