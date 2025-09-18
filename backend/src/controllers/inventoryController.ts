import { Request, Response } from 'express';
import { InventoryService, PurchaseData, RestockData } from '../services/inventoryService';

export class InventoryController {
  static async purchaseSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Sweet ID is required'
        });
        return;
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const purchaseData: PurchaseData = {
        quantity: req.body.quantity,
        userId
      };

      const result = await InventoryService.purchaseSweet(id, purchaseData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        const statusCode = result.message === 'Sweet not found' ? 404 :
                          result.message === 'User not found' ? 401 :
                          result.message === 'Insufficient quantity available' ? 400 : 400;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Purchase sweet controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during purchase'
      });
    }
  }

  static async restockSweet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Sweet ID is required'
        });
        return;
      }

      const restockData: RestockData = {
        quantity: req.body.quantity
      };

      const result = await InventoryService.restockSweet(id, restockData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        const statusCode = result.message === 'Sweet not found' ? 404 : 400;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      console.error('Restock sweet controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during restock'
      });
    }
  }
}