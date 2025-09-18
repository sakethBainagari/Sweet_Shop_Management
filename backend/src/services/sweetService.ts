import { prisma } from '../index';

export interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface SweetResponse {
  success: boolean;
  data?: any;
  message?: string;
  errors?: string[];
}

export class SweetService {
  static async getAllSweets(): Promise<SweetResponse> {
    try {
      const sweets = await prisma.sweet.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: sweets
      };
    } catch (error) {
      console.error('Get all sweets error:', error);
      return {
        success: false,
        message: 'Failed to retrieve sweets'
      };
    }
  }

  static async searchSweets(filters: SearchFilters): Promise<SweetResponse> {
    try {
      const where: any = {};

      if (filters.name) {
        where.name = {
          contains: filters.name,
          mode: 'insensitive'
        };
      }

      if (filters.category) {
        where.category = {
          equals: filters.category
        };
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {};
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice;
        }
      }

      const sweets = await prisma.sweet.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: sweets
      };
    } catch (error) {
      console.error('Search sweets error:', error);
      return {
        success: false,
        message: 'Failed to search sweets'
      };
    }
  }

  static async createSweet(sweetData: CreateSweetData): Promise<SweetResponse> {
    try {
      // Validate input
      const validationErrors = this.validateSweetData(sweetData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        };
      }

      // Check if sweet with same name already exists
      const existingSweet = await prisma.sweet.findFirst({
        where: { name: sweetData.name.trim() }
      });

      if (existingSweet) {
        return {
          success: false,
          message: 'Sweet with this name already exists'
        };
      }

      // Create sweet
      const sweet = await prisma.sweet.create({
        data: {
          name: sweetData.name.trim(),
          category: sweetData.category.trim(),
          price: sweetData.price,
          quantity: sweetData.quantity,
          description: sweetData.description?.trim() || null
        }
      });

      return {
        success: true,
        data: sweet,
        message: 'Sweet created successfully'
      };
    } catch (error) {
      console.error('Create sweet error:', error);
      return {
        success: false,
        message: 'Failed to create sweet'
      };
    }
  }

  static async updateSweet(id: string, updateData: UpdateSweetData): Promise<SweetResponse> {
    try {
      // Check if sweet exists
      const existingSweet = await prisma.sweet.findUnique({
        where: { id }
      });

      if (!existingSweet) {
        return {
          success: false,
          message: 'Sweet not found'
        };
      }

      // Validate input
      const validationErrors = this.validateUpdateData(updateData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        };
      }

      // Check if name is being updated and if it conflicts with existing sweet
      if (updateData.name && updateData.name.trim() !== existingSweet.name) {
        const nameConflict = await prisma.sweet.findFirst({
          where: {
            name: updateData.name.trim(),
            id: { not: id }
          }
        });

        if (nameConflict) {
          return {
            success: false,
            message: 'Sweet with this name already exists'
          };
        }
      }

      // Update sweet
      const updatedSweet = await prisma.sweet.update({
        where: { id },
        data: {
          ...(updateData.name && { name: updateData.name.trim() }),
          ...(updateData.category && { category: updateData.category.trim() }),
          ...(updateData.price !== undefined && { price: updateData.price }),
          ...(updateData.quantity !== undefined && { quantity: updateData.quantity }),
          ...(updateData.description !== undefined && { description: updateData.description?.trim() || null })
        }
      });

      return {
        success: true,
        data: updatedSweet,
        message: 'Sweet updated successfully'
      };
    } catch (error) {
      console.error('Update sweet error:', error);
      return {
        success: false,
        message: 'Failed to update sweet'
      };
    }
  }

  static async deleteSweet(id: string): Promise<SweetResponse> {
    try {
      // Check if sweet exists
      const existingSweet = await prisma.sweet.findUnique({
        where: { id }
      });

      if (!existingSweet) {
        return {
          success: false,
          message: 'Sweet not found'
        };
      }

      // Delete sweet
      await prisma.sweet.delete({
        where: { id }
      });

      return {
        success: true,
        message: 'Sweet deleted successfully'
      };
    } catch (error) {
      console.error('Delete sweet error:', error);
      return {
        success: false,
        message: 'Failed to delete sweet'
      };
    }
  }

  static async getSweetById(id: string): Promise<SweetResponse> {
    try {
      const sweet = await prisma.sweet.findUnique({
        where: { id }
      });

      if (!sweet) {
        return {
          success: false,
          message: 'Sweet not found'
        };
      }

      return {
        success: true,
        data: sweet
      };
    } catch (error) {
      console.error('Get sweet by ID error:', error);
      return {
        success: false,
        message: 'Failed to retrieve sweet'
      };
    }
  }

  private static validateSweetData(data: CreateSweetData): string[] {
    const errors: string[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required');
    } else if (data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Category validation
    if (!data.category || data.category.trim().length === 0) {
      errors.push('Category is required');
    }

    // Price validation
    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    } else if (data.price < 0) {
      errors.push('Price cannot be negative');
    }

    // Quantity validation
    if (data.quantity === undefined || data.quantity === null) {
      errors.push('Quantity is required');
    } else if (data.quantity < 0) {
      errors.push('Quantity cannot be negative');
    } else if (!Number.isInteger(data.quantity)) {
      errors.push('Quantity must be a whole number');
    }

    return errors;
  }

  private static validateUpdateData(data: UpdateSweetData): string[] {
    const errors: string[] = [];

    // Name validation
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Name cannot be empty');
      } else if (data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
    }

    // Category validation
    if (data.category !== undefined) {
      if (!data.category || data.category.trim().length === 0) {
        errors.push('Category cannot be empty');
      }
    }

    // Price validation
    if (data.price !== undefined) {
      if (data.price < 0) {
        errors.push('Price cannot be negative');
      }
    }

    // Quantity validation
    if (data.quantity !== undefined) {
      if (data.quantity < 0) {
        errors.push('Quantity cannot be negative');
      } else if (!Number.isInteger(data.quantity)) {
        errors.push('Quantity must be a whole number');
      }
    }

    return errors;
  }
}