import { Router } from 'express';
import { SweetController } from '../controllers/sweetController';
import { InventoryController } from '../controllers/inventoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (require authentication)
router.get('/', authenticateToken, SweetController.getAllSweets);
router.get('/search', authenticateToken, SweetController.searchSweets);

// Admin-only routes for CRUD operations
router.post('/', authenticateToken, requireAdmin, SweetController.createSweet);
router.put('/:id', authenticateToken, requireAdmin, SweetController.updateSweet);
router.delete('/:id', authenticateToken, requireAdmin, SweetController.deleteSweet);

// Inventory management routes
router.post('/:id/purchase', authenticateToken, InventoryController.purchaseSweet);
router.post('/:id/restock', authenticateToken, requireAdmin, InventoryController.restockSweet);

// Get single sweet by ID (authenticated users)
router.get('/:id', authenticateToken, SweetController.getSweetById);

export default router;