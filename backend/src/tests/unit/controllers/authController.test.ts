import { Request, Response } from 'express';
import { AuthController } from '../../../controllers/authController';
import { AuthService } from '../../../services/authService';

// Mock the AuthService
jest.mock('../../../services/authService');
const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('AuthController Unit Tests', () => {
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

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };

      const mockResult = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: '1',
            name: userData.name,
            email: userData.email,
            role: 'USER'
          },
          token: 'mock-jwt-token'
        }
      };

      mockRequest.body = userData;
      MockedAuthService.registerUser = jest.fn().mockResolvedValue(mockResult);

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(MockedAuthService.registerUser).toHaveBeenCalledWith(userData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle registration validation errors', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };

      const mockResult = {
        success: false,
        message: 'Email already exists'
      };

      mockRequest.body = userData;
      MockedAuthService.registerUser = jest.fn().mockResolvedValue(mockResult);

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle internal server errors', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
      };

      mockRequest.body = userData;
      MockedAuthService.registerUser = jest.fn().mockRejectedValue(new Error('Database error'));

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during registration'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Password123!'
      };

      const mockResult = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: '1',
            name: 'John Doe',
            email: loginData.email,
            role: 'USER'
          },
          token: 'mock-jwt-token'
        }
      };

      mockRequest.body = loginData;
      MockedAuthService.loginUser = jest.fn().mockResolvedValue(mockResult);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(MockedAuthService.loginUser).toHaveBeenCalledWith(loginData);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'WrongPassword'
      };

      const mockResult = {
        success: false,
        message: 'Invalid credentials'
      };

      mockRequest.body = loginData;
      MockedAuthService.loginUser = jest.fn().mockResolvedValue(mockResult);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle login server errors', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'Password123!'
      };

      mockRequest.body = loginData;
      MockedAuthService.loginUser = jest.fn().mockRejectedValue(new Error('Database error'));

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during login'
      });
    });
  });
});