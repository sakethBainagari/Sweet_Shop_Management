import request from 'supertest';
import { createApp, prisma } from '../index';

const app = createApp();

describe('Sweet Management API - TDD Implementation', () => {
  let adminToken: string;
  let userToken: string;
  let testSweetId: string;
  let adminUserId: string;
  let regularUserId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.purchase.deleteMany();
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['admin@test.com', 'user@test.com']
        }
      }
    });

    // Create admin user
    const adminRegResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'admin123'
      })
      .expect(201);
    
    adminUserId = adminRegResponse.body.data.user.id;

    // Update admin user to have ADMIN role BEFORE login
    await prisma.user.update({
      where: { id: adminUserId },
      data: { role: 'ADMIN' }
    });

    // Create regular user
    const userRegResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'user1234'
      })
      .expect(201);

    regularUserId = userRegResponse.body.data.user.id;

    // Login to get tokens with updated user roles
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123'
      })
      .expect(200);

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@test.com',
        password: 'user1234'
      })
      .expect(200);

    adminToken = adminLogin.body.data.token;
    userToken = userLogin.body.data.token;

    // Test setup complete
  }, 30000);

  afterAll(async () => {
    // Database disconnection is handled by the imported prisma instance
  });

  afterEach(async () => {
    // Clean up database after each test (but preserve users)
    await prisma.purchase.deleteMany();
    await prisma.sweet.deleteMany();
    // Keep users - they persist throughout all tests
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      const sweet1 = await prisma.sweet.create({
        data: {
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 15.99,
          quantity: 50,
          description: 'Delicious chocolate cake'
        }
      });

      await prisma.sweet.create({
        data: {
          name: 'Vanilla Ice Cream',
          category: 'Ice Cream',
          price: 8.50,
          quantity: 30,
          description: 'Creamy vanilla ice cream'
        }
      });

      testSweetId = sweet1.id;
    });

    it('should return all sweets for authenticated user', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('category');
      expect(response.body.data[0]).toHaveProperty('price');
      expect(response.body.data[0]).toHaveProperty('quantity');
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication required');
    });

    it('should return empty array when no sweets exist', async () => {
      // Clean up sweets
      await prisma.sweet.deleteMany();

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await prisma.sweet.createMany({
        data: [
          {
            name: 'Chocolate Cake',
            category: 'Cakes',
            price: 15.99,
            quantity: 50,
            description: 'Delicious chocolate cake'
          },
          {
            name: 'Vanilla Cake',
            category: 'Cakes',
            price: 12.99,
            quantity: 30,
            description: 'Classic vanilla cake'
          },
          {
            name: 'Strawberry Ice Cream',
            category: 'Ice Cream',
            price: 8.50,
            quantity: 25,
            description: 'Fresh strawberry ice cream'
          }
        ]
      });
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Chocolate Cake');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Cakes')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((sweet: any) => sweet.category === 'Cakes')).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=10&maxPrice=20')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((sweet: any) => sweet.price >= 10 && sweet.price <= 20)).toBe(true);
    });

    it('should combine multiple search filters', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=cake&category=Cakes&minPrice=10&maxPrice=20')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=nonexistent')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return 401 for unauthenticated search', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=cake')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication required');
    });
  });

  describe('POST /api/sweets', () => {
    it('should create new sweet for admin user', async () => {
      const sweetData = {
        name: 'New Chocolate Cake',
        category: 'Cakes',
        price: 18.99,
        quantity: 40,
        description: 'Premium chocolate cake'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(sweetData.name);
      expect(response.body.data.category).toBe(sweetData.category);
      expect(response.body.data.price).toBe(sweetData.price);
      expect(response.body.data.quantity).toBe(sweetData.quantity);
      expect(response.body.data.description).toBe(sweetData.description);
    });

    it('should return 403 for non-admin user', async () => {
      const sweetData = {
        name: 'Unauthorized Cake',
        category: 'Cakes',
        price: 15.99,
        quantity: 30
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Admin access required');
    });

    it('should return 401 for unauthenticated request', async () => {
      const sweetData = {
        name: 'Unauthenticated Cake',
        category: 'Cakes',
        price: 15.99,
        quantity: 30
      };

      const response = await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication required');
    });

    it('should return 400 for invalid sweet data', async () => {
      const invalidData = {
        name: '', // Empty name
        category: 'Cakes',
        price: -10, // Negative price
        quantity: 30
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });
  });

  describe('PUT /api/sweets/:id', () => {
    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Original Cake',
          category: 'Cakes',
          price: 15.99,
          quantity: 50,
          description: 'Original description'
        }
      });
      testSweetId = sweet.id;
    });

    it('should update sweet for admin user', async () => {
      const updateData = {
        name: 'Updated Cake',
        price: 18.99,
        quantity: 40,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
      expect(response.body.data.quantity).toBe(updateData.quantity);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it('should return 403 for non-admin user', async () => {
      const updateData = {
        name: 'Unauthorized Update',
        price: 20.99
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Admin access required');
    });

    it('should return 404 for non-existent sweet', async () => {
      const updateData = {
        name: 'Non-existent Update',
        price: 20.99
      };

      const response = await request(app)
        .put('/api/sweets/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Sweet not found');
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Cake to Delete',
          category: 'Cakes',
          price: 15.99,
          quantity: 50
        }
      });
      testSweetId = sweet.id;
    });

    it('should delete sweet for admin user', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Sweet deleted successfully');
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Admin access required');
    });

    it('should return 404 for non-existent sweet', async () => {
      const response = await request(app)
        .delete('/api/sweets/nonexistent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Sweet not found');
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    beforeEach(async () => {
      // Check if users still exist before each test and recreate if needed
      let adminExists = await prisma.user.findUnique({ where: { id: adminUserId } });
      let userExists = await prisma.user.findUnique({ where: { id: regularUserId } });
      
      if (!adminExists || !userExists) {
        // Recreate users if missing due to test isolation issues
        
        // Clean up completely and recreate users
        await prisma.purchase.deleteMany();
        await prisma.sweet.deleteMany();
        await prisma.user.deleteMany({
          where: {
            email: {
              in: ['admin@test.com', 'user@test.com']
            }
          }
        });

        // Recreate admin user
        const adminRegResponse = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'admin123'
          });
        
        adminUserId = adminRegResponse.body.data.user.id;

        // Update admin user to have ADMIN role
        await prisma.user.update({
          where: { id: adminUserId },
          data: { role: 'ADMIN' }
        });

        // Recreate regular user
        const userRegResponse = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Regular User',
            email: 'user@test.com',
            password: 'user1234'
          });

        regularUserId = userRegResponse.body.data.user.id;

        // Get new tokens
        const adminLogin = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'admin@test.com',
            password: 'admin123'
          });

        const userLogin = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'user@test.com',
            password: 'user1234'
          });

        adminToken = adminLogin.body.data.token;
        userToken = userLogin.body.data.token;
      }

      const sweet = await prisma.sweet.create({
        data: {
          name: 'Cake for Purchase',
          category: 'Cakes',
          price: 15.99,
          quantity: 50
        }
      });
      testSweetId = sweet.id;
    });

    it('should purchase sweet successfully', async () => {
      const purchaseData = {
        quantity: 2
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.purchase).toHaveProperty('id');
      expect(response.body.data.purchase.quantity).toBe(purchaseData.quantity);
      expect(response.body.data.purchase.totalPrice).toBe(15.99 * 2);
      expect(response.body.data.updatedSweet.quantity).toBe(48); // 50 - 2
    });

    it('should return 400 for insufficient quantity', async () => {
      const purchaseData = {
        quantity: 60 // More than available (50)
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient quantity');
    });

    it('should return 404 for non-existent sweet', async () => {
      const purchaseData = {
        quantity: 1
      };

      const response = await request(app)
        .post('/api/sweets/nonexistent-id/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Sweet not found');
    });

    it('should return 400 for invalid purchase quantity', async () => {
      const purchaseData = {
        quantity: 0 // Invalid quantity
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Cake for Restock',
          category: 'Cakes',
          price: 15.99,
          quantity: 20
        }
      });
      testSweetId = sweet.id;
    });

    it('should restock sweet for admin user', async () => {
      const restockData = {
        quantity: 30
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(50); // 20 + 30
      expect(response.body.message).toContain('Sweet restocked successfully');
    });

    it('should return 403 for non-admin user', async () => {
      const restockData = {
        quantity: 25
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(restockData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Admin access required');
    });

    it('should return 404 for non-existent sweet', async () => {
      const restockData = {
        quantity: 25
      };

      const response = await request(app)
        .post('/api/sweets/nonexistent-id/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Sweet not found');
    });

    it('should return 400 for invalid restock quantity', async () => {
      const restockData = {
        quantity: -5 // Invalid quantity
      };

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(restockData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });
  });
});