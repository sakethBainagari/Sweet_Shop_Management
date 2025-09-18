// Mock the Prisma client for service testing
const mockPrisma = {
  sweet: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  },
  purchase: {
    create: jest.fn(),
    findMany: jest.fn()
  }
};

// Mock the prisma import
jest.mock('../../../utils/prisma', () => ({
  prisma: mockPrisma
}));

import { SweetService } from '../../../services/sweetService';

describe('SweetService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSweets', () => {
    it('should return sweets successfully', async () => {
      const mockSweets = [
        {
          id: '1',
          name: 'Chocolate Cake',
          category: 'Cake',
          price: 15.99,
          quantity: 10,
          description: 'Delicious chocolate cake'
        }
      ];

      mockPrisma.sweet.findMany.mockResolvedValue(mockSweets);

      const result = await SweetService.getAllSweets();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sweets retrieved successfully');
      expect(result.data?.sweets).toEqual(mockSweets);
      expect(mockPrisma.sweet.findMany).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockPrisma.sweet.findMany.mockRejectedValue(new Error('Database error'));

      const result = await SweetService.getAllSweets();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to retrieve sweets');
    });
  });

  describe('getSweetById', () => {
    it('should return sweet by ID successfully', async () => {
      const mockSweet = {
        id: '1',
        name: 'Chocolate Cake',
        category: 'Cake',
        price: 15.99,
        quantity: 10,
        description: 'Delicious chocolate cake'
      };

      mockPrisma.sweet.findUnique.mockResolvedValue(mockSweet);

      const result = await SweetService.getSweetById('1');

      expect(result.success).toBe(true);
      expect(result.data?.sweet).toEqual(mockSweet);
      expect(mockPrisma.sweet.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    it('should handle sweet not found', async () => {
      mockPrisma.sweet.findUnique.mockResolvedValue(null);

      const result = await SweetService.getSweetById('999');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Sweet not found');
    });
  });

  describe('createSweet', () => {
    it('should create sweet successfully', async () => {
      const sweetData = {
        name: 'New Cake',
        category: 'Cake',
        price: 18.99,
        quantity: 15,
        description: 'A new delicious cake'
      };

      const mockCreatedSweet = {
        id: '2',
        ...sweetData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.sweet.create.mockResolvedValue(mockCreatedSweet);

      const result = await SweetService.createSweet(sweetData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sweet created successfully');
      expect(result.data?.sweet).toEqual(mockCreatedSweet);
      expect(mockPrisma.sweet.create).toHaveBeenCalledWith({
        data: sweetData
      });
    });

    it('should validate required fields', async () => {
      const invalidData = {
        name: '',
        category: '',
        price: -1,
        quantity: -1,
        description: ''
      };

      const result = await SweetService.createSweet(invalidData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Validation failed');
      expect(result.errors).toContain('Name is required');
      expect(result.errors).toContain('Category is required');
      expect(result.errors).toContain('Price cannot be negative');
      expect(result.errors).toContain('Quantity cannot be negative');
    });
  });

  describe('updateSweet', () => {
    it('should update sweet successfully', async () => {
      const updateData = {
        name: 'Updated Cake',
        price: 20.99
      };

      const existingSweet = {
        id: '1',
        name: 'Old Cake',
        category: 'Cake',
        price: 15.99,
        quantity: 10,
        description: 'Old description'
      };

      const updatedSweet = {
        ...existingSweet,
        ...updateData,
        updatedAt: new Date()
      };

      mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrisma.sweet.update.mockResolvedValue(updatedSweet);

      const result = await SweetService.updateSweet('1', updateData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sweet updated successfully');
      expect(result.data?.sweet.name).toBe('Updated Cake');
      expect(result.data?.sweet.price).toBe(20.99);
    });

    it('should handle sweet not found for update', async () => {
      mockPrisma.sweet.findUnique.mockResolvedValue(null);

      const result = await SweetService.updateSweet('999', { name: 'Updated' });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Sweet not found');
    });
  });

  describe('deleteSweet', () => {
    it('should delete sweet successfully', async () => {
      const existingSweet = {
        id: '1',
        name: 'Cake to Delete',
        category: 'Cake',
        price: 15.99,
        quantity: 10,
        description: 'Will be deleted'
      };

      mockPrisma.sweet.findUnique.mockResolvedValue(existingSweet);
      mockPrisma.sweet.delete.mockResolvedValue(existingSweet);

      const result = await SweetService.deleteSweet('1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Sweet deleted successfully');
      expect(mockPrisma.sweet.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
    });

    it('should handle sweet not found for deletion', async () => {
      mockPrisma.sweet.findUnique.mockResolvedValue(null);

      const result = await SweetService.deleteSweet('999');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Sweet not found');
    });
  });
});