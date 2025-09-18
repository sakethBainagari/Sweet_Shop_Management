import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// Admin-only routes
router.get('/admin/users', authenticateToken, requireAdmin, (_req, res) => {
  // TODO: Implement admin user management
  res.json({
    success: true,
    message: 'Admin users endpoint - to be implemented'
  });
});

export default router;