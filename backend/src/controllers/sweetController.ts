import { Request, Response } from 'express';
import { SweetService, CreateSweetData, UpdateSweetData, SearchFilters } from '../services/sweetService';

export class SweetController {
  static async getAllSweets(_req: Request, res: Response): Promise<void> {
    try {
      const result = await SweetService.getAllSweets();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Get all sweets controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async searchSweets(req: Request, res: Response): Promise<void> {
    try {
      const filters: SearchFilters = {};

      if (req.query.name) {
        filters.name = req.query.name as string;
      }

      if (req.query.category) {
        filters.category = req.query.category as string;
      }

      if (req.query.minPrice) {
        filters.minPrice = parseFloat(req.query.minPrice as string);
      }

      if (req.query.maxPrice) {
        filters.maxPrice = parseFloat(req.query.maxPrice as string);
      }

      const result = await SweetService.searchSweets(filters);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Search sweets controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  static async createSweet(req: Request, res: Response): Promise<void> {
    try {
      const sweetData: CreateSweetData = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        description: req.body.description
      };

      const result = await SweetService.createSweet(sweetData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Create sweet controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during sweet creation'
      });
    }
  }

  static async updateSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Sweet ID is required'
        });
        return;
      }

      const updateData: UpdateSweetData = {};

      if (req.body.name !== undefined) updateData.name = req.body.name;
      if (req.body.category !== undefined) updateData.category = req.body.category;
      if (req.body.price !== undefined) updateData.price = req.body.price;
      if (req.body.quantity !== undefined) updateData.quantity = req.body.quantity;
      if (req.body.description !== undefined) updateData.description = req.body.description;

      const result = await SweetService.updateSweet(id, updateData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        const statusCode = result.message === 'Sweet not found' ? 404 : 400;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Update sweet controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during sweet update'
      });
    }
  }

  static async deleteSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Sweet ID is required'
        });
        return;
      }

      const result = await SweetService.deleteSweet(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        const statusCode = result.message === 'Sweet not found' ? 404 : 500;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Delete sweet controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during sweet deletion'
      });
    }
  }

  static async getSweetById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Sweet ID is required'
        });
        return;
      }

      const result = await SweetService.getSweetById(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Get sweet by ID controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}