import { Request, Response } from 'express';
import { AuthService, RegisterUserData, LoginCredentials } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterUserData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };

      const result = await AuthService.registerUser(userData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Registration controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginCredentials = {
        email: req.body.email,
        password: req.body.password
      };

      const result = await AuthService.loginUser(credentials);

      if (result.success) {
        res.status(200).json(result);
      } else {
        // Return 400 for validation errors, 401 for authentication errors
        const isValidationError = result.errors && result.errors.length > 0;
        const statusCode = isValidationError ? 400 : 401;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login'
      });
    }
  }
}