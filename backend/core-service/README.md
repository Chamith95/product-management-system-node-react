# Product Management Service 

A TypeScript Node.js Express application for product Management .

## Features
- ✅ **TypeScript** - Full type safety and modern JavaScript features
- ✅ **TypeORM** - Object-relational mapping with PostgreSQL
- ✅ **Validation** - Input validation using class-validator
- ✅ **Error Handling** - Comprehensive error handling middleware
- ✅ **Logging** - Request logging and error tracking
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Testing** - Jest configuration for unit testing

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
# Copy the base environment file from project root
cp ../../env.example ../../.env
# Edit .env with your database credentials
```

3. **Set up PostgreSQL database:**
```sql
CREATE DATABASE products_db;
```

4. **Run the application:**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## License

MIT License
