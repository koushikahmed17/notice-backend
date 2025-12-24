# Vercel Deployment Guide

This guide will walk you through deploying your Express backend to Vercel step by step.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, for CLI deployment)
3. Your MongoDB connection string ready
4. Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment Process

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

Or use npx without installing:

```bash
npx vercel
```

### Step 2: Prepare Your Project

The following files have been created for Vercel deployment:

- `vercel.json` - Vercel configuration
- `api/index.ts` - Serverless function handler

### Step 3: Set Up Environment Variables

You need to configure environment variables in Vercel:

**Required Environment Variables:**

- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to `production` (already configured in vercel.json)
- `PORT` - Optional (Vercel handles this automatically)
- `LOG_LEVEL` - Optional (defaults to 'info')

**Optional Environment Variables (if you use them):**

- `JWT_SECRET` - If you use JWT authentication
- Any other environment variables your app requires

### Step 4: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in or create an account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Select your repository

3. **Configure Project Settings**
   - **Framework Preset**: Other (or leave as default)
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build` (or `yarn build`)
   - **Output Directory**: Leave empty (not needed for serverless)
   - **Install Command**: `npm install` (or `yarn install`)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each required variable:
     - `MONGODB_URI` = `your-mongodb-connection-string`
     - `NODE_ENV` = `production`
     - Add any other variables your app needs
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Step 5: Deploy via CLI (Alternative Method)

1. **Login to Vercel**

   ```bash
   vercel login
   ```

2. **Deploy to Production**

   ```bash
   vercel --prod
   ```

3. **Set Environment Variables via CLI**

   ```bash
   vercel env add MONGODB_URI
   vercel env add NODE_ENV
   # Follow prompts to enter values
   ```

   Or add them in the Vercel dashboard (easier).

### Step 6: Verify Deployment

1. **Check Health Endpoint**
   - Visit: `https://your-project-name.vercel.app/health`
   - Should return: `{"success":true,"message":"Server is running",...}`

2. **Test Your API Endpoints**
   - Test your API routes at: `https://your-project-name.vercel.app/api/...`
   - Make sure CORS is configured for your frontend domain

### Step 7: Update CORS Configuration (Important!)

Update your `src/app.ts` to include your Vercel domain in allowed origins:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://your-frontend-domain.vercel.app', // Add your frontend domain
  'https://your-project-name.vercel.app', // Add your backend domain if needed
];
```

### Step 8: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Important Notes

### Database Connection

- The database connection is cached across serverless function invocations
- Vercel serverless functions may have cold starts, so the first request might be slower
- Make sure your MongoDB Atlas (or other MongoDB provider) allows connections from Vercel's IP ranges

### File Uploads

- If you're using file uploads, consider using Vercel Blob Storage or external storage (AWS S3, Cloudinary, etc.)
- The `uploads/` folder won't persist on Vercel's serverless functions

### Environment Variables

- Never commit `.env` files to Git
- Always add environment variables through Vercel dashboard or CLI
- Different environments (Production, Preview, Development) can have different values

### Build Process

- Vercel automatically runs `npm install` and `npm run build`
- Make sure your `build` script in `package.json` compiles TypeScript correctly
- The compiled output in `dist/` is used by the serverless function

### Logs

- View logs in Vercel Dashboard → Your Project → Deployments → Click on a deployment → "Functions" tab
- Or use: `vercel logs`

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `dependencies` (not just `devDependencies`)
- Verify TypeScript compilation works locally: `npm run build`

### Database Connection Issues

- Verify `MONGODB_URI` is set correctly in Vercel environment variables
- Check MongoDB Atlas network access allows all IPs (0.0.0.0/0) or Vercel's IPs
- Check MongoDB connection string format

### 500 Errors

- Check function logs in Vercel dashboard
- Verify all environment variables are set
- Check database connection status

### CORS Errors

- Update `allowedOrigins` in `src/app.ts` with your frontend domain
- Ensure CORS middleware is properly configured

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>
```

## Next Steps

1. Set up continuous deployment (automatic on Git push)
2. Configure custom domain
3. Set up monitoring and alerts
4. Configure rate limiting for production
5. Set up backup strategies for your database

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Check your project logs in Vercel dashboard for specific errors
