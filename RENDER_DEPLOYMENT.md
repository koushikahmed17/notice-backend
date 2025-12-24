# Render Deployment Guide

This guide will walk you through deploying your Express backend to Render step by step.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Your MongoDB connection string ready
3. Git repository (GitHub, GitLab, or Bitbucket) - Render requires a Git repository

## Step-by-Step Deployment Process

### Step 1: Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket). Render requires a Git repository for deployment.

```bash
# If you haven't already, initialize and push to Git
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up for a free account (you can use GitHub, GitLab, or email)
3. Verify your email if required

### Step 3: Create a New Web Service

1. **Go to Render Dashboard**
   - After logging in, click **"New +"** button
   - Select **"Web Service"**

2. **Connect Your Repository**
   - If this is your first time, you'll need to connect your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize Render to access your repositories
   - Select the repository containing your backend code

3. **Configure Your Service**
   - **Name**: Enter a name for your service (e.g., `nebs-backend`)
   - **Region**: Choose the closest region to your users
   - **Branch**: Select the branch to deploy (usually `main` or `master`)
   - **Root Directory**: Leave empty (or `./` if your project is in a subdirectory)
   - **Runtime**: Select `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose `Free` (or upgrade to a paid plan for better performance)

### Step 4: Set Up Environment Variables

1. **In the Render Dashboard**, scroll down to **"Environment Variables"** section

2. **Add Required Variables:**
   Click **"Add Environment Variable"** for each:

   - **MONGODB_URI**
     - Key: `MONGODB_URI`
     - Value: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
     - Click **"Save"**

   - **NODE_ENV**
     - Key: `NODE_ENV`
     - Value: `production`
     - Click **"Save"`

   - **PORT** (Optional - Render sets this automatically)
     - Render automatically sets the `PORT` environment variable
     - You don't need to set this manually

   - **LOG_LEVEL** (Optional)
     - Key: `LOG_LEVEL`
     - Value: `info` (or `debug` for more verbose logging)
     - Click **"Save"**

   - **FRONTEND_URL** (If you have a frontend)
     - Key: `FRONTEND_URL`
     - Value: Your frontend URL (e.g., `https://your-frontend.onrender.com`)
     - Click **"Save"**

### Step 5: Configure Advanced Settings (Optional)

1. **Health Check Path** (Recommended)
   - Scroll to **"Health Check Path"**
   - Enter: `/api/health`
   - This helps Render monitor your service health

2. **Auto-Deploy** (Recommended)
   - Make sure **"Auto-Deploy"** is enabled
   - This will automatically redeploy when you push to your selected branch

3. **Environment**
   - Select **"Production"** environment

### Step 6: Deploy

1. **Review Your Settings**
   - Double-check all environment variables are set
   - Verify build and start commands are correct

2. **Click "Create Web Service"**
   - Render will start building and deploying your application
   - This process usually takes 3-5 minutes for the first deployment

3. **Monitor the Build**
   - You'll see real-time build logs
   - Wait for the build to complete successfully
   - The service will automatically start after a successful build

### Step 7: Verify Deployment

1. **Check Service Status**
   - Once deployed, your service will have a URL like: `https://nebs-backend.onrender.com`
   - The status should show as **"Live"**

2. **Test Health Endpoint**
   - Visit: `https://your-service-name.onrender.com/api/health`
   - Should return:
     ```json
     {
       "success": true,
       "message": "Server is running",
       "timestamp": "2024-01-XX..."
     }
     ```

3. **Test Your API Endpoints**
   - Test your API routes at: `https://your-service-name.onrender.com/api/...`
   - Make sure CORS is configured for your frontend domain

### Step 8: Update CORS Configuration (Important!)

Update your `src/app.ts` to include your Render domain in allowed origins:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://your-frontend.onrender.com', // Add your frontend domain
  'https://your-backend.onrender.com',  // Add your backend domain if needed
];
```

Then commit and push:
```bash
git add src/app.ts
git commit -m "Update CORS for Render deployment"
git push
```

Render will automatically redeploy.

## Using Render Blueprint (Alternative Method)

If you prefer using a configuration file, you can use the `render.yaml` file included in this project:

1. **Push `render.yaml` to your repository** (already included)

2. **In Render Dashboard:**
   - Click **"New +"** → **"Blueprint"**
   - Connect your repository
   - Render will automatically detect `render.yaml`
   - Review the configuration
   - Click **"Apply"**

3. **Set Environment Variables:**
   - You'll still need to set `MONGODB_URI` manually in the Render dashboard
   - Other variables from `render.yaml` will be applied automatically

## Important Notes

### Free Tier Limitations

- **Spinning Down**: Free services spin down after 15 minutes of inactivity
- **Cold Starts**: First request after spin-down may take 30-60 seconds
- **Upgrade**: Consider upgrading to a paid plan for always-on service

### Database Connection

- Make sure your MongoDB Atlas (or other MongoDB provider) allows connections from all IPs (0.0.0.0/0)
- Render's IP addresses are dynamic, so you can't whitelist specific IPs
- Test your MongoDB connection string locally before deploying

### File Uploads

- The `uploads/` folder won't persist on Render's free tier
- Consider using external storage (AWS S3, Cloudinary, etc.) for file uploads
- Or upgrade to a paid plan with persistent disk storage

### Environment Variables

- Never commit `.env` files to Git
- Always add environment variables through Render dashboard
- Environment variables are encrypted and secure

### Build Process

- Render automatically runs `npm install` and your build command
- Make sure your `build` script in `package.json` compiles TypeScript correctly
- The compiled output in `dist/` is used by the start command

### Logs

- View logs in Render Dashboard → Your Service → **"Logs"** tab
- Logs are available in real-time
- Logs are retained for a limited time on free tier

### Custom Domain (Optional)

1. Go to your service settings in Render
2. Click **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions
5. SSL certificates are automatically provisioned

## Troubleshooting

### Build Fails

**Symptoms:**
- Build fails with errors in logs

**Solutions:**
- Check build logs in Render dashboard
- Ensure all dependencies are in `dependencies` (not just `devDependencies`)
- Verify TypeScript compilation works locally: `npm run build`
- Check for missing files or incorrect paths

### Service Won't Start

**Symptoms:**
- Build succeeds but service shows as "Failed" or won't start

**Solutions:**
- Check service logs in Render dashboard
- Verify `MONGODB_URI` is set correctly
- Ensure `start` command is correct: `npm start`
- Check if port is configured correctly (Render sets PORT automatically)

### Database Connection Issues

**Symptoms:**
- Service starts but can't connect to database

**Solutions:**
- Verify `MONGODB_URI` is set correctly in Render environment variables
- Check MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Verify MongoDB connection string format
- Test connection string locally first

### 500 Errors

**Symptoms:**
- Service is live but returns 500 errors

**Solutions:**
- Check service logs in Render dashboard
- Verify all environment variables are set
- Check database connection status
- Look for error messages in logs

### CORS Errors

**Symptoms:**
- Frontend can't access API due to CORS errors

**Solutions:**
- Update `allowedOrigins` in `src/app.ts` with your frontend domain
- Ensure CORS middleware is properly configured
- Check if credentials are being sent (set `credentials: true` in CORS config)

### Service Spins Down (Free Tier)

**Symptoms:**
- Service is slow or times out after inactivity

**Solutions:**
- This is normal for free tier - service spins down after 15 minutes
- First request after spin-down takes longer (cold start)
- Consider upgrading to paid plan for always-on service
- Or use a service like UptimeRobot to ping your service every 10 minutes

### Timeout Issues

**Symptoms:**
- Requests timeout or take too long

**Solutions:**
- Free tier has 30-second request timeout
- Optimize database queries
- Add indexes to frequently queried fields
- Use pagination for large datasets
- Upgrade to paid plan for longer timeouts

## Useful Commands

```bash
# Test build locally
npm run build

# Test start command locally
npm start

# Check environment variables locally
# Create .env file with your variables
```

## Monitoring

1. **View Logs:**
   - Render Dashboard → Your Service → **"Logs"** tab
   - Real-time log streaming available

2. **View Metrics:**
   - Render Dashboard → Your Service → **"Metrics"** tab
   - CPU, Memory, and Request metrics

3. **Set Up Alerts:**
   - Render Dashboard → Your Service → **"Alerts"** tab
   - Get notified of service issues

## Next Steps

1. Set up continuous deployment (automatic on Git push) ✅
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Configure rate limiting for production
5. Set up backup strategies for your database
6. Consider upgrading to paid plan for production use

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Check your service logs in Render dashboard for specific errors
- Render Support: Available in dashboard for paid plans

## Migration from Vercel

If you're migrating from Vercel:

1. ✅ All Vercel-specific files have been removed
2. ✅ Code has been updated to work with traditional Node.js servers
3. ✅ No serverless function handlers needed
4. ✅ Standard Express server setup
5. ✅ File logging works (not read-only like Vercel)

Your application is now ready for Render deployment!

