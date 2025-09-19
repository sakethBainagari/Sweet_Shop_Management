# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop with user authentication, inventory management, and purchase functionality.

## 🚀 Live Demo

- **Frontend:** [https://sweet-shop-management-ruddy.vercel.app](https://sweet-shop-management-ruddy.vercel.app)
- **Backend API:** [https://sweet-shop-management-backend.onrender.com](https://sweet-shop-management-backend.onrender.com)

## 🧪 Test Credentials

For easy testing and evaluation, use these pre-configured accounts:

### 👨‍💼 Admin Account
- **Email:** `admin@sweetshop.com`
- **Password:** `admin123456`
- **Features:** Full access to create, edit, delete sweets, manage inventory

### 👤 Customer Account  
- **Email:** `customer@example.com`
- **Password:** `customer123`
- **Features:** Browse sweets, make purchases, view purchase history

*Note: These credentials are displayed on the login/register pages for convenience.*

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** ORM for database operations
- **MongoDB Atlas** for data storage
- **JWT** for authentication
- **bcryptjs** for password hashing

### Deployment
- **Frontend:** Vercel (Automatic deployment from GitHub)
- **Backend:** Render (Automatic deployment from GitHub)
- **Database:** MongoDB Atlas (Cloud database)

## ✨ Features

### Authentication & Authorization
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes

### Sweet Management (Admin Only)
- ✅ Create new sweets
- ✅ Update sweet details
- ✅ Delete sweets
- ✅ Manage inventory/stock

### Customer Features
- ✅ Browse available sweets
- ✅ Search and filter sweets
- ✅ Purchase sweets
- ✅ View purchase history

### Additional Features
- ✅ Responsive design
- ✅ Real-time inventory updates
- ✅ Error handling and validation
- ✅ Loading states and user feedback

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│   Frontend      │ ←────────────────→ │   Backend       │
│   (Vercel)      │    API Calls      │   (Render)      │
│   React + TS    │                   │   Node.js + TS  │
└─────────────────┘                   └─────────────────┘
                                              │
                                              │ Prisma ORM
                                              ↓
                                      ┌─────────────────┐
                                      │   Database      │
                                      │ (MongoDB Atlas) │
                                      └─────────────────┘
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Sweets Management
- `GET /api/sweets` - Get all sweets (protected)
- `GET /api/sweets/search` - Search sweets (protected)
- `GET /api/sweets/:id` - Get sweet by ID (protected)
- `POST /api/sweets` - Create sweet (admin only)
- `PUT /api/sweets/:id` - Update sweet (admin only)
- `DELETE /api/sweets/:id` - Delete sweet (admin only)

### Inventory & Purchases
- `POST /api/sweets/:id/purchase` - Purchase sweet (protected)
- `POST /api/sweets/:id/restock` - Restock sweet (admin only)

### Health Check
- `GET /api/health` - API health status
- `GET /api/db-test` - Database connectivity test

## 🧪 Testing the Application

1. **Visit the live demo:** [Sweet Shop Management System](https://sweet-shop-management-ruddy.vercel.app)

2. **Login as Admin:**
   - Use the "Fill" button for admin credentials
   - Test creating, editing, and deleting sweets
   - Test inventory management

3. **Login as Customer:**
   - Use the "Fill" button for customer credentials  
   - Test browsing and purchasing sweets
   - Test search and filter functionality

## 📋 Sample Data

The system comes with pre-loaded sample sweets:
- **Chocolate Cake** - $25.99 (Cakes category)
- **Strawberry Cupcake** - $8.50 (Cupcakes category)  
- **Gummy Bears** - $5.99 (Candies category)

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Protected API routes
- ✅ Role-based access control

## 🚀 Deployment Details

### Automatic Deployment Pipeline
1. **Code Push** → GitHub repository
2. **Vercel** automatically deploys frontend changes
3. **Render** automatically deploys backend changes
4. **Zero downtime** deployments

### Environment Configuration
- All sensitive data stored in environment variables
- Separate development and production configurations
- Secure database connection strings

---

## 📞 Support

If you encounter any issues or need assistance:
1. Check the browser console for error messages
2. Verify network connectivity
3. Try refreshing the page
4. Use the sample credentials provided

**Happy Testing!** 🍭✨