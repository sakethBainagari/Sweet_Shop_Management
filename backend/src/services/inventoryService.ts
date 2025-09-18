import { Prisma } from '@prisma/client';
import { prisma } from '../index';

export interface PurchaseData {
  quantity: number;
  userId: string;
}

export interface RestockData {
  quantity: number;
}

export interface InventoryResponse {
  success: boolean;
  data?: any;
  message?: string;
  errors?: string[];
}

export class InventoryService {
  static async purchaseSweet(sweetId: string, purchaseData: PurchaseData): Promise<InventoryResponse> {
    try {
      // Validate input
      const validationErrors = this.validatePurchaseData(purchaseData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        };
      }

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Check if user exists
        const userExists = await tx.user.findUnique({
          where: { id: purchaseData.userId }
        });

        if (!userExists) {
          throw new Error(`User with ID ${purchaseData.userId} not found`);
        }

        // Check if sweet exists and get current quantity
        const sweet = await tx.sweet.findUnique({
          where: { id: sweetId }
        });

        if (!sweet) {
          throw new Error('Sweet not found');
        }

        // Check if sufficient quantity is available
        if (sweet.quantity < purchaseData.quantity) {
          throw new Error('Insufficient quantity available');
        }

        // Calculate total price
        const totalPrice = sweet.price * purchaseData.quantity;

        // Create purchase record
        const purchase = await tx.purchase.create({
          data: {
            sweetId,
            userId: purchaseData.userId,
            quantity: purchaseData.quantity,
            totalPrice
          }
        });

        // Update sweet quantity
        const updatedSweet = await tx.sweet.update({
          where: { id: sweetId },
          data: {
            quantity: sweet.quantity - purchaseData.quantity
          }
        });

        return {
          purchase,
          updatedSweet
        };
      });

      return {
        success: true,
        data: result,
        message: 'Purchase completed successfully'
      };
    } catch (error: any) {
      // Handle inventory operation errors

      if (error.message && error.message.includes('User with ID') && error.message.includes('not found')) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      if (error.message === 'Sweet not found') {
        return {
          success: false,
          message: 'Sweet not found'
        };
      }

      if (error.message === 'Insufficient quantity available') {
        return {
          success: false,
          message: 'Insufficient quantity available'
        };
      }

      return {
        success: false,
        message: 'Purchase failed. Please try again.'
      };
    }
  }

  static async restockSweet(sweetId: string, restockData: RestockData): Promise<InventoryResponse> {
    try {
      // Validate input
      const validationErrors = this.validateRestockData(restockData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        };
      }

      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Check if sweet exists
        const sweet = await tx.sweet.findUnique({
          where: { id: sweetId }
        });

        if (!sweet) {
          throw new Error('Sweet not found');
        }

        // Update sweet quantity
        const updatedSweet = await tx.sweet.update({
          where: { id: sweetId },
          data: {
            quantity: sweet.quantity + restockData.quantity
          }
        });

        return updatedSweet;
      });

      return {
        success: true,
        data: result,
        message: 'Sweet restocked successfully'
      };
    } catch (error: any) {
      // Handle restock operation errors

      if (error.message === 'Sweet not found') {
        return {
          success: false,
          message: 'Sweet not found'
        };
      }

      return {
        success: false,
        message: 'Restock failed. Please try again.'
      };
    }
  }

  private static validatePurchaseData(data: PurchaseData): string[] {
    const errors: string[] = [];

    // Quantity validation
    if (data.quantity === undefined || data.quantity === null) {
      errors.push('Quantity is required');
    } else if (data.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    } else if (!Number.isInteger(data.quantity)) {
      errors.push('Quantity must be a whole number');
    }

    // User ID validation
    if (!data.userId || data.userId.trim().length === 0) {
      errors.push('User ID is required');
    }

    return errors;
  }

  private static validateRestockData(data: RestockData): string[] {
    const errors: string[] = [];

    // Quantity validation
    if (data.quantity === undefined || data.quantity === null) {
      errors.push('Quantity is required');
    } else if (data.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    } else if (!Number.isInteger(data.quantity)) {
      errors.push('Quantity must be a whole number');
    }

    return errors;
  }
}