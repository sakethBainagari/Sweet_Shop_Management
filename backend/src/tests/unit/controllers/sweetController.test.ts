import { Request, Response } from 'express';
import { SweetController } from '../../../controllers/sweetController';
import { SweetService } from '../../../services/sweetService';

// Mock the SweetService
jest.mock('../../../services/sweetService');
const MockedSweetService = SweetService as jest.MockedClass<typeof SweetService>;

describe('SweetController Unit Tests', () => {
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
      headers: {}
    };
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSweets', () => {
    it('should fetch all sweets successfully', async () => {
      const mockSweets = [
        {
          id: '1',
          name: 'Chocolate Cake',
          description: 'Delicious chocolate cake',
          price: 15.99,
          quantity: 10,
          category: 'Cake',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Strawberry Tart',
          description: 'Fresh strawberry tart',
          price: 12.99,
          quantity: 5,
          category: 'Tart',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const mockResult = {
        success: true,
        message: 'Sweets fetched successfully',
        data: { sweets: mockSweets }
      };

      MockedSweetService.getAllSweets = jest.fn().mockResolvedValue(mockResult);

      await SweetController.getAllSweets(mockRequest as Request, mockResponse as Response);

      expect(MockedSweetService.getAllSweets).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors when fetching sweets', async () => {
      const mockResult = {
        success: false,
        message: 'Database error'
      };

      MockedSweetService.getAllSweets = jest.fn().mockResolvedValue(mockResult);

      await SweetController.getAllSweets(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle internal server errors', async () => {
      MockedSweetService.getAllSweets = jest.fn().mockRejectedValue(new Error('Database error'));

      await SweetController.getAllSweets(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('searchSweets', () => {
    it('should search sweets with filters successfully', async () => {
      const mockResult = {
        success: true,
        message: 'Sweets found',
        data: { sweets: [] }
      };

      mockRequest.query = {
        name: 'chocolate',
        category: 'Cake',
        minPrice: '10',
        maxPrice: '20'
      };

      MockedSweetService.searchSweets = jest.fn().mockResolvedValue(mockResult);

      await SweetController.searchSweets(mockRequest as Request, mockResponse as Response);

      expect(MockedSweetService.searchSweets).toHaveBeenCalledWith({
        name: 'chocolate',
        category: 'Cake',
        minPrice: 10,
        maxPrice: 20
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should handle search errors', async () => {
      const mockResult = {
        success: false,
        message: 'Search failed'
      };

      MockedSweetService.searchSweets = jest.fn().mockResolvedValue(mockResult);

      await SweetController.searchSweets(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getSweetById', () => {
    it('should fetch sweet by ID successfully', async () => {
      const mockSweet = {
        id: '1',
        name: 'Chocolate Cake',
        description: 'Delicious chocolate cake',
        price: 15.99,
        quantity: 10,
        category: 'Cake',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResult = {
        success: true,
        message: 'Sweet fetched successfully',
        data: { sweet: mockSweet }
      };

      mockRequest.params = { id: '1' };
      MockedSweetService.getSweetById = jest.fn().mockResolvedValue(mockResult);

      await SweetController.getSweetById(mockRequest as Request, mockResponse as Response);

      expect(MockedSweetService.getSweetById).toHaveBeenCalledWith('1');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle sweet not found', async () => {
      const mockResult = {
        success: false,
        message: 'Sweet not found'
      };

      mockRequest.params = { id: '999' };
      MockedSweetService.getSweetById = jest.fn().mockResolvedValue(mockResult);

      await SweetController.getSweetById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle missing ID parameter', async () => {
      mockRequest.params = {};

      await SweetController.getSweetById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Sweet ID is required'
      });
    });
  });

  describe('createSweet', () => {
    it('should create sweet successfully', async () => {
      const sweetData = {
        name: 'New Cake',
        description: 'A new delicious cake',
        price: 18.99,
        quantity: 15,
        category: 'Cake'
      };

      const mockResult = {
        success: true,
        message: 'Sweet created successfully',
        data: {
          sweet: {
            id: '3',
            ...sweetData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      mockRequest.body = sweetData;
      MockedSweetService.createSweet = jest.fn().mockResolvedValue(mockResult);

      await SweetController.createSweet(mockRequest as Request, mockResponse as Response);

      expect(MockedSweetService.createSweet).toHaveBeenCalledWith(sweetData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle validation errors', async () => {
      const invalidSweetData = {
        name: '',
        price: -5,
        quantity: -1
      };

      const mockResult = {
        success: false,
        message: 'Validation failed'
      };

      mockRequest.body = invalidSweetData;
      MockedSweetService.createSweet = jest.fn().mockResolvedValue(mockResult);

      await SweetController.createSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle internal server errors', async () => {
      const sweetData = {
        name: 'New Cake',
        category: 'Cake',
        price: 18.99,
        quantity: 15,
        description: 'A new cake'
      };

      mockRequest.body = sweetData;
      MockedSweetService.createSweet = jest.fn().mockRejectedValue(new Error('Database error'));

      await SweetController.createSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during sweet creation'
      });
    });
  });

  describe('updateSweet', () => {
    it('should update sweet successfully', async () => {
      const updateData = {
        name: 'Updated Cake',
        price: 20.99
      };

      const mockResult = {
        success: true,
        message: 'Sweet updated successfully',
        data: { sweet: { id: '1', ...updateData } }
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = updateData;
      MockedSweetService.updateSweet = jest.fn().mockResolvedValue(mockResult);

      await SweetController.updateSweet(mockRequest as Request, mockResponse as Response);

      expect(MockedSweetService.updateSweet).toHaveBeenCalledWith('1', updateData);
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should handle sweet not found', async () => {
      const mockResult = {
        success: false,
        message: 'Sweet not found'
      };

      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Updated' };
      MockedSweetService.updateSweet = jest.fn().mockResolvedValue(mockResult);

      await SweetController.updateSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it('should handle missing ID parameter', async () => {
      mockRequest.params = {};
      mockRequest.body = { name: 'Updated' };

      await SweetController.updateSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Sweet ID is required'
      });
    });
  });

  describe('deleteSweet', () => {
    it('should delete sweet successfully', async () => {
      const mockResult = {
        success: true,
        message: 'Sweet deleted successfully'
      };

      mockRequest.params = { id: '1' };
      MockedSweetService.deleteSweet = jest.fn().mockResolvedValue(mockResult);

      await SweetController.deleteSweet(mockRequest as Request, mockResponse as Response);

      expect(MockedSweetService.deleteSweet).toHaveBeenCalledWith('1');
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should handle sweet not found for deletion', async () => {
      const mockResult = {
        success: false,
        message: 'Sweet not found'
      };

      mockRequest.params = { id: '999' };
      MockedSweetService.deleteSweet = jest.fn().mockResolvedValue(mockResult);

      await SweetController.deleteSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
    });

    it('should handle missing ID parameter for deletion', async () => {
      mockRequest.params = {};

      await SweetController.deleteSweet(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Sweet ID is required'
      });
    });
  });
});