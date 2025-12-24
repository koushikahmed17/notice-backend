# How to Run the Nebs Backend Project

## Prerequisites

Before running the project, make sure you have installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)
3. **npm** (comes with Node.js) or **yarn**

## Step-by-Step Setup

### 1. Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

This will install all required packages including:
- Express.js
- TypeScript
- Mongoose
- Zod
- JWT
- Winston
- And all other dependencies

### 2. Set Up Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

**On Windows:**
```bash
copy .env.example .env
```

**On Mac/Linux:**
```bash
cp .env.example .env
```

Then edit the `.env` file with your configuration:

```env
# Node Environment
NODE_ENV=development

# Server Port
PORT=3000

# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/nebs-backend

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nebs-backend

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRE=7d

# Bcrypt Rounds
BCRYPT_ROUNDS=10

# Log Level
LOG_LEVEL=info
```

**Important:** Change the `JWT_SECRET` to a strong, random string in production!

### 3. Start MongoDB

#### Option A: Local MongoDB

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start it manually:
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### 4. Seed the Database (Optional but Recommended)

This will create sample users and notices for testing:

```bash
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- Sample notices

### 5. Run the Project

#### Development Mode (with auto-reload):

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you make changes.

#### Production Mode:

First build the TypeScript code:
```bash
npm run build
```

Then start the server:
```bash
npm start
```

### 6. Verify It's Running

You should see output like:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on port 3000 in development mode
```

Test the health endpoint:
- Open browser: `http://localhost:3000/health`
- Or use Postman/curl: `GET http://localhost:3000/health`

## Quick Start Commands Summary

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from .env.example and update)

# 3. Start MongoDB (local or use Atlas)

# 4. Seed database (optional)
npm run seed

# 5. Run in development mode
npm run dev
```

## Testing the API

### Using Postman

1. Import the Postman collection from `postman/` folder
2. Import the environment file
3. Run the **Login** request first
4. Then test other endpoints

### Using cURL

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Create Notice (after getting token):**
```bash
curl -X POST http://localhost:3000/api/notices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "targetDepartmentOrIndividual": "IT Department",
    "targetType": "department",
    "noticeTitle": "Test Notice",
    "noticeType": "Maintenance",
    "publishDate": "2024-12-25T00:00:00.000Z",
    "noticeBody": "This is a test notice"
  }'
```

## Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `.env`:
```env
PORT=3001
```

### MongoDB Connection Error

**Error:** `MongoDB connection error`

**Solutions:**
1. Make sure MongoDB is running (local) or connection string is correct (Atlas)
2. Check firewall settings
3. For Atlas: Whitelist your IP address
4. Verify `MONGODB_URI` in `.env` is correct

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild the project
npm run build
```

### JWT Secret Error

Make sure `JWT_SECRET` in `.env` is set and has at least 1 character.

## Project Structure

```
nebs-backend/
├── src/              # Source code
├── dist/             # Compiled JavaScript (after build)
├── logs/             # Log files (auto-created)
├── postman/          # Postman collection
├── scripts/          # Utility scripts
├── .env              # Environment variables (create this)
├── .env.example      # Example env file
└── package.json      # Dependencies and scripts
```

## Next Steps

1. ✅ Project is running
2. ✅ Test with Postman collection
3. ✅ Create your first notice
4. ✅ Explore the API endpoints

## API Base URL

Once running, your API will be available at:
```
http://localhost:3000/api
```

## Need Help?

- Check the logs in `logs/` folder
- Review error messages in the terminal
- Verify all environment variables are set correctly
- Make sure MongoDB is running and accessible




