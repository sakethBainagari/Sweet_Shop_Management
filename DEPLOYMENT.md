# Sweet Shop Management - Deployment Guide

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for VPS/Cloud)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - At least 2GB RAM
   - 10GB disk space

2. **Quick Start**
   ```bash
   # Clone the repository
   git clone <your-repo-url>
   cd Sweet_Shop_Management

   # Copy environment file
   cp .env.production .env

   # Edit environment variables
   nano .env

   # Deploy
   docker-compose up -d
   ```

3. **Environment Variables to Configure**
   - `DB_PASSWORD`: Secure database password
   - `JWT_SECRET`: Strong JWT secret (min 32 characters)
   - `FRONTEND_URL`: Your frontend domain
   - `VITE_API_BASE_URL`: Your API domain

### Option 2: Separate Hosting (Frontend + Backend)

#### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables:
   - `VITE_API_BASE_URL`: Your backend API URL

#### Backend (Railway/Render/Heroku)
1. Set up PostgreSQL database
2. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Strong secret key
   - `FRONTEND_URL`: Your frontend URL
3. Deploy backend code
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Option 3: Local Development/Testing

```bash
# Install dependencies
npm install # in both frontend and backend directories

# Set up database (PostgreSQL required)
cd backend
npx prisma migrate dev
npx prisma db seed

# Start backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

## 🔧 Configuration Checklist

### Required Environment Variables

**Backend (.env)**
- ✅ `DATABASE_URL`: PostgreSQL connection string
- ✅ `JWT_SECRET`: Secure random string (min 32 chars)
- ✅ `JWT_EXPIRES_IN`: Token expiration (e.g., "7d")
- ✅ `PORT`: Server port (default: 3001)
- ✅ `NODE_ENV`: "production" for deployment
- ✅ `FRONTEND_URL`: Frontend domain for CORS

**Frontend (.env)**
- ✅ `VITE_API_BASE_URL`: Backend API URL
- ✅ `VITE_NODE_ENV`: "production" for deployment

### Security Considerations
- ✅ Use strong, unique passwords
- ✅ Enable HTTPS in production
- ✅ Configure proper CORS origins
- ✅ Use environment variables for secrets
- ✅ Regularly update dependencies

## 📊 Health Checks

After deployment, verify:
- ✅ Frontend loads at your domain
- ✅ API health check: `GET /api/health`
- ✅ Database connection works
- ✅ User registration/login functions
- ✅ Sweet shop features work properly

## 🐛 Troubleshooting

**Common Issues:**
1. **Database Connection Error**
   - Check DATABASE_URL format
   - Verify database is running
   - Check network connectivity

2. **CORS Errors**
   - Verify FRONTEND_URL in backend env
   - Check API URLs in frontend

3. **Build Failures**
   - Ensure Node.js 18+ is used
   - Check for TypeScript errors
   - Verify all dependencies are installed

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all services are healthy
4. Check network connectivity between services