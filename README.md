# Sweet Shop Management System

A full-stack web application for managing a sweet shop's inventory, sales, and user authentication. Built with modern technologies following TDD (Test-Driven Development) principles.

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest with Supertest

### Frontend
- **Framework**: React with TypeScript and Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Testing**: Vitest with React Testing Library

## 📋 Features

### Core Functionality
- ✅ User registration and authentication
- ✅ JWT-based secure API endpoints
- ✅ Sweet inventory management (CRUD operations)
- ✅ Purchase tracking and inventory updates
- ✅ Role-based access control (User/Admin)
- ✅ Search and filter sweets by name, category, or price

### Technical Features
- ✅ Clean Architecture with separation of concerns
- ✅ Comprehensive test coverage
- ✅ TypeScript for type safety
- ✅ RESTful API design
- ✅ Responsive UI design
- ✅ Error handling and validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweet-shop-management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your PostgreSQL connection details
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env if needed (API base URL is configured)
   ```

4. **Database Setup**
   ```bash
   cd ../backend
   npx prisma generate
   npx prisma db push
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3001

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will be available at http://localhost:5173

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm run test
```

## 📁 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── tests/          # Test files
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── hooks/         # Custom React hooks
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## 🧪 Testing Strategy

This project follows Test-Driven Development (TDD) methodology:

1. **Write tests first** - Define expected behavior
2. **Run tests** - They should fail initially (Red)
3. **Implement code** - Make tests pass (Green)
4. **Refactor** - Improve code while keeping tests passing

### Test Coverage Goals
- Backend: >80% coverage
- Frontend: >70% coverage
- Integration tests for critical user flows

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Sweets (Protected)
- `GET /api/sweets` - List all sweets
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Add new sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## 🤝 Contributing

1. Follow TDD principles - write tests first
2. Maintain clean code standards
3. Add AI co-authors to commits when using AI assistance
4. Ensure all tests pass before submitting PRs

## 📝 My AI Usage

*To be completed during development phases*

## 📄 License

This project is part of a technical assessment and is not licensed for external use.

---

**Note**: This project demonstrates modern full-stack development practices with emphasis on testing, clean architecture, and maintainable code.