# Nebs Backend

## Project Overview

Nebs Backend is a robust Express.js backend application built with TypeScript for a Clinic Management System. It provides a RESTful API with comprehensive features including authentication, data validation, error handling, and logging. The application follows a clean, structured architecture with separation of concerns for maintainability and scalability.

## Tech Stack

- **Express.js** - Web framework for building RESTful APIs
- **TypeScript** - Type-safe JavaScript for better code quality
- **Mongoose** - MongoDB ODM (Object Data Modeling)
- **Zod** - Schema validation library
- **JWT (jsonwebtoken)** - Authentication and authorization
- **Winston** - Logging library
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Bcryptjs** - Password hashing
- **Express Rate Limit** - Rate limiting middleware
- **Multer** - File upload handling
- **Dotenv** - Environment variable management

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nebs-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add the required environment variables (see ENV Variable Instructions below)

4. **Start MongoDB**
   - Ensure MongoDB is running locally, or
   - Use MongoDB Atlas (cloud) and update the `MONGODB_URI` in your `.env` file

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode (after building)
   npm run build
   npm start
   ```

6. **Verify the installation**
   - The server should start on the configured port (default: 3000)
   - Visit `http://localhost:3000/api/health` to check if the API is running

## ENV Variable Instructions

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Application Environment
NODE_ENV=development

# Server Configuration
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nebs-backend

# Logging Configuration
LOG_LEVEL=info
```

### Optional Variables

```env
# Frontend URL (for CORS configuration)
FRONTEND_URL=http://localhost:3001
```

### Variable Descriptions

- **NODE_ENV**: Application environment (`development`, `production`, or `test`)
- **PORT**: Port number on which the server will run (default: `3000`)
- **MONGODB_URI**: MongoDB connection string (required)
  - Local: `mongodb://localhost:27017/nebs-backend`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
- **LOG_LEVEL**: Logging level (`error`, `warn`, `info`, or `debug`)
- **FRONTEND_URL**: Frontend application URL for CORS configuration (optional, defaults to `*`)

### Notes

- All environment variables are validated on application startup using Zod
- Invalid or missing required variables will cause the application to exit with an error
- Never commit the `.env` file to version control
- Use different `.env` files for different environments (development, staging, production)
