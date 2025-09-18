# Render + Vercel Deployment Guide 🚀

This guide will walk you through deploying your Sweet Shop Management System using:
- **Render**: Backend (Node.js/Express API)
- **Vercel**: Frontend (React/TypeScript)
- **Supabase**: Database (already configured)

## 📋 Prerequisites

- [x] GitHub repository with your code
- [x] Render account (sign up at render.com)
- [x] Vercel account (sign up at vercel.com)
- [x] Supabase database (already configured)

---

## 🚀 Phase 1: Deploy Backend to Render

### Step 1: Connect GitHub to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository: `Sweet_Shop_Management`
5. Click **"Connect"**

### Step 2: Configure Build Settings

Render will auto-detect your `render.yaml` file, but verify these settings:

```yaml
Name: sweet-shop-backend
Runtime: Node
Build Command: cd backend && npm install && npm run build && npx prisma generate
Start Command: cd backend && npm start
```

### Step 3: Set Environment Variables

⚠️ **SECURITY NOTE**: Never put real credentials in documentation files! Use your actual values only in the Render dashboard.

In the Render dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=your_supabase_database_url_here
JWT_SECRET=your_long_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app.vercel.app  # Update this after frontend deployment
```

**Where to get your actual values:**
- `DATABASE_URL`: From your Supabase project settings
- `JWT_SECRET`: Generate a secure random string (64+ characters)
- Get these from your local `.env` file (don't commit that file!)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Your backend will be available at: `https://your-app-name.onrender.com`

### Step 5: Test Backend

Test your deployed backend:
```bash
curl https://your-app-name.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Sweet Shop API is running smoothly! 🍬",
  "timestamp": "2025-09-18T...",
  "environment": "production"
}
```

---

## 🎨 Phase 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend Configuration

First, update the frontend environment configuration:

1. Create `frontend/.env.production` (locally, don't commit):
```bash
VITE_API_URL=https://your-app-name.onrender.com
```

### Step 2: Connect GitHub to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `Sweet_Shop_Management`
4. Select **"frontend"** as the root directory

### Step 3: Configure Build Settings

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Set Environment Variables

In Vercel dashboard, add:
```bash
VITE_API_URL=https://your-app-name.onrender.com
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your frontend will be available at: `https://your-app.vercel.app`

---

## 🔗 Phase 3: Final Configuration

### Step 1: Update Backend CORS

Go back to Render dashboard and update the environment variable:
```bash
FRONTEND_URL=https://your-app.vercel.app
```

This will automatically redeploy your backend with the correct CORS configuration.

### Step 2: Test Full Application

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test the complete flow:
   - Registration
   - Login
   - Dashboard access
   - Sweet management
   - Purchase functionality

---

## 🛠️ Troubleshooting

### Backend Issues

**Build Failures:**
```bash
# Check logs in Render dashboard
# Common issues:
# - Missing environment variables
# - TypeScript compilation errors
# - Prisma generation failures
```

**Database Connection:**
```bash
# Verify DATABASE_URL is correct
# Check Supabase connection limits
# Ensure IP allowlist includes 0.0.0.0/0 for Render
```

### Frontend Issues

**API Connection:**
```bash
# Verify VITE_API_URL points to correct Render URL
# Check browser network tab for CORS errors
# Ensure backend FRONTEND_URL is updated
```

**Build Errors:**
```bash
# Check Vercel build logs
# Verify all environment variables are set
# Ensure TypeScript compilation succeeds
```

---

## 📊 Deployment URLs

After successful deployment, you'll have:

- **Backend API**: `https://your-app-name.onrender.com`
- **Frontend App**: `https://your-app.vercel.app`
- **Health Check**: `https://your-app-name.onrender.com/api/health`
- **API Docs**: `https://your-app-name.onrender.com/api` (if you have swagger)

---

## 🔒 Security Checklist

- [x] No `.env` files committed to GitHub
- [x] Environment variables set in platform dashboards
- [x] CORS properly configured
- [x] HTTPS enabled on both platforms
- [x] Database credentials secured
- [x] JWT secrets properly set

---

## 💡 Platform Benefits

### Render
- ✅ Generous free tier (750 hours/month)
- ✅ Automatic SSL certificates
- ✅ Easy environment variable management
- ✅ Auto-deploys from GitHub
- ✅ Built-in health checks

### Vercel
- ✅ Excellent performance (Edge Network)
- ✅ Instant deployments
- ✅ Preview deployments for PRs
- ✅ Automatic HTTPS
- ✅ Built-in analytics

---

## 🚀 Ready to Deploy!

Your application is now configured for Render + Vercel deployment. Follow the steps above, and you'll have a production-ready Sweet Shop Management System!

**Estimated Deployment Time**: 15-20 minutes total
**Cost**: Free tier on both platforms
**Performance**: Production-grade with global CDN