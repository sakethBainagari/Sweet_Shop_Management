import { Request, Response } from 'express';
import { InventoryController } from '../../../controllers/inventoryController';
import { InventoryService } from '../../../services/inventoryService';

// Mock the InventoryService
jest.mock('../../../services/inventoryService');
const MockedInventoryService = InventoryService as jest.MockedClass<typeof InventoryService>;

describe('InventoryController Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
      user: {
        userId: '1',
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'USER'
      }
    } as any;
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('purchaseSweet', () => {
    it('should purchase sweet successfully', async () => {
      const purchaseData = {
        quantity: 2
      };

      const mockResult = {
        success: true,
        message: 'Sweet purchased successfully',
        data: {
          purchase: {
            id: '1',
            userId: '1',
            sweetId: '1',
            quantity: 2,
            totalPrice: 31.98,
            createdAt: new Date()
          }
        }
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = purchaseData;
      MockedInventoryService.purchaseSweet = jest.fn().mockResolvedValue(mockResult);

      await InventoryController.purchaseSweet(mockRequest as Request, mockResponse as Response);

      expect(MockedInventoryService.purchaseSweet).toHaveBeenCalledWith('1', {
        quantity: 2,
        userId: '1'
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle missing sweet ID', async () => {
      mockRequest.params = {};
      mockRequest.body = { quantity: 2 };

      await InventoryController.purchaseSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Sweet ID is required'
      });
    });

    it('should handle missing user authentication', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { quantity: 2 };
      (mockRequest as any).user = undefined;

      await InventoryController.purchaseSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'User authentication required'
      });
    });

    it('should handle sweet not found', async () => {
      const mockResult = {
        success: false,
        message: 'Sweet not found'
      };

      mockRequest.params = { id: '999' };
      mockRequest.body = { quantity: 2 };
      MockedInventoryService.purchaseSweet = jest.fn().mockResolvedValue(mockResult);

      await InventoryController.purchaseSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle user not found', async () => {
      const mockResult = {
        success: false,
        message: 'User not found'
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = { quantity: 2 };
      MockedInventoryService.purchaseSweet = jest.fn().mockResolvedValue(mockResult);

      await InventoryController.purchaseSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle insufficient quantity', async () => {
      const mockResult = {
        success: false,
        message: 'Insufficient quantity available'
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = { quantity: 100 };
      MockedInventoryService.purchaseSweet = jest.fn().mockResolvedValue(mockResult);

      await InventoryController.purchaseSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle internal server errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { quantity: 2 };
      MockedInventoryService.purchaseSweet = jest.fn().mockRejectedValue(new Error('Database error'));

      await InventoryController.purchaseSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during purchase'
      });
    });
  });

  describe('restockSweet', () => {
    it('should restock sweet successfully', async () => {
      const restockData = {
        quantity: 10
      };

      const mockResult = {
        success: true,
        message: 'Sweet restocked successfully',
        data: {
          sweet: {
            id: '1',
            name: 'Chocolate Cake',
            quantity: 20,
            updatedAt: new Date()
          }
        }
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = restockData;
      MockedInventoryService.restockSweet = jest.fn().mockResolvedValue(mockResult);

      await InventoryController.restockSweet(mockRequest as Request, mockResponse as Response);

      expect(MockedInventoryService.restockSweet).toHaveBeenCalledWith('1', restockData);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle missing sweet ID for restock', async () => {
      mockRequest.params = {};
      mockRequest.body = { quantity: 10 };

      await InventoryController.restockSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Sweet ID is required'
      });
    });

    it('should handle sweet not found for restock', async () => {
      const mockResult = {
        success: false,
        message: 'Sweet not found'
      };

      mockRequest.params = { id: '999' };
      mockRequest.body = { quantity: 10 };
      MockedInventoryService.restockSweet = jest.fn().mockResolvedValue(mockResult);

      await InventoryController.restockSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle validation errors for restock', async () => {
      const mockResult = {
        success: false,
        message: 'Invalid quantity'
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = { quantity: -5 };
      MockedInventoryService.restockSweet = jest.fn().mockResolvedValue(mockResult);

      await InventoryController.restockSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle internal server errors for restock', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { quantity: 10 };
      MockedInventoryService.restockSweet = jest.fn().mockRejectedValue(new Error('Database error'));

      await InventoryController.restockSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during restock'
      });
    });
  });
});