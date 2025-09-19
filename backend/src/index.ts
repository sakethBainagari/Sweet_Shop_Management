import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import sweetRoutes from './routes/sweets';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Create Express app factory function
export const createApp = (): express.Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://sweet-shop-management-saketh.vercel.app',
      'https://sweet-shop-management-saketh-sakeths-projects-9e9dcc73.vercel.app',
      'https://sweet-shop-management-saketh-8a8ezeod9.vercel.app',
      'https://sweet-shop-management-ruddy.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/sweets', sweetRoutes);

  // Basic health check route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Sweet Shop API is running' });
  });

  // Database connectivity test
  app.get('/api/db-test', async (_req, res) => {
    try {
      // Test MongoDB connection by trying to find users (will work even if collection is empty)
      await prisma.user.findMany({ take: 1 });
      res.json({ status: 'OK', message: 'Database connected successfully' });
    } catch (error) {
      console.error('Database test failed:', error);
      res.status(500).json({ 
        status: 'ERROR', 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Error handling middleware
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  return app;
};

// Create the app instance
const app = createApp();

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`🚀 Sweet Shop API server is running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
    console.log(`🔐 Authentication endpoints available at http://localhost:${PORT}/api/auth`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
  });
}

// Export both the app and prisma for testing
export { prisma };
export default app;