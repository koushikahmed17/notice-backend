# Nebs Backend

A robust Express.js backend application built with TypeScript, Mongoose, and Zod for validation.

## Features

- ✅ TypeScript for type safety
- ✅ Express.js for RESTful API
- ✅ Mongoose for MongoDB ODM
- ✅ Zod for schema validation
- ✅ JWT authentication
- ✅ Winston for logging
- ✅ Rate limiting
- ✅ Error handling middleware
- ✅ ESLint & Prettier for code quality
- ✅ Structured project architecture

## Project Structure

```
Nebs-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── schemas/         # Zod validation schemas
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── routes/          # Route definitions
│   ├── middlewares/     # Express middlewares
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── constants/       # Constants
│   ├── interfaces/      # Interface definitions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Test files
├── scripts/             # Utility scripts
└── logs/                # Log files
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nebs-backend
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
LOG_LEVEL=info
```

### 3. Start MongoDB
- **Local:** Start MongoDB service on your machine
- **Cloud:** Use MongoDB Atlas and update `MONGODB_URI` in `.env`

### 4. Seed Database (Optional)
```bash
npm run seed
```
Creates sample notices for testing

### 5. Run the Project
```bash
npm run dev
```

Server will start at `http://localhost:3000`

**For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

## Usage

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
```

## API Endpoints

### Notices
- `GET /api/notices` - Get all notices (with filtering: status, noticeType, targetType)
- `GET /api/notices/:id` - Get notice by ID
- `POST /api/notices` - Create notice
- `PUT /api/notices/:id` - Update notice
- `PATCH /api/notices/:id/status` - Update notice status (draft/published/unpublished)
- `DELETE /api/notices/:id` - Delete notice

## Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **Zod** - Schema validation
- **JWT** - Authentication
- **Winston** - Logging
- **Bcrypt** - Password hashing
- **Helmet** - Security
- **CORS** - Cross-origin resource sharing

## License

ISC


