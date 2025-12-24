# Fix 500 Error - FUNCTION_INVOCATION_FAILED

## The Problem
You're getting a 500 error when hitting `/api/health`. This usually means:
1. **Missing `MONGODB_URI` environment variable** (most common)
2. **Database connection failing**
3. **Code error in the handler**

## Step 1: Check Vercel Function Logs

This is the MOST IMPORTANT step to see the actual error:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com
   - Sign in and select your project: `notice-backend`

2. **View Logs:**
   - Click on **"Deployments"** tab
   - Click on your **latest deployment**
   - Click on **"Functions"** tab
   - Click on **"api/index"** function
   - Scroll down to see the **error logs**

3. **Look for:**
   - Error messages
   - Stack traces
   - "MONGODB_URI" related errors
   - Any import/initialization errors

## Step 2: Set Environment Variables

The most common cause is missing `MONGODB_URI`:

1. **Go to Vercel Dashboard:**
   - Your Project → **Settings** → **Environment Variables**

2. **Add Required Variables:**
   - Click **"Add New"**
   - Add these variables:

   **Variable 1:**
   - **Key:** `MONGODB_URI`
   - **Value:** Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
   - **Environment:** Select **Production**, **Preview**, and **Development** (all three)

   **Variable 2:**
   - **Key:** `NODE_ENV`
   - **Value:** `production`
   - **Environment:** Select **Production** (and Preview if you want)

   **Variable 3 (Optional):**
   - **Key:** `LOG_LEVEL`
   - **Value:** `info`
   - **Environment:** All

3. **Save** all variables

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click three dots (⋯) on latest deployment
   - Click **"Redeploy"**

## Step 3: Verify MongoDB Atlas Settings

If you're using MongoDB Atlas:

1. **Check Network Access:**
   - Go to MongoDB Atlas Dashboard
   - Click **"Network Access"** in left sidebar
   - Click **"Add IP Address"**
   - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**

2. **Verify Connection String:**
   - Go to **"Database"** → **"Connect"**
   - Copy your connection string
   - Make sure it includes your password (replace `<password>` with actual password)
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

## Step 4: Test Again

After setting environment variables and redeploying:

1. **Wait for deployment to complete** (1-3 minutes)

2. **Test Health Endpoint:**
   ```
   https://notice-backend-teal.vercel.app/health
   ```
   OR
   ```
   https://notice-backend-teal.vercel.app/api/health
   ```

3. **Expected Response:**
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2024-01-XX..."
   }
   ```

## Common Error Messages

### "MONGODB_URI environment variable is not set"
**Solution:** Add `MONGODB_URI` in Vercel Environment Variables

### "MongoDB connection error"
**Solution:** 
- Check MongoDB Atlas network access (allow 0.0.0.0/0)
- Verify connection string is correct
- Check MongoDB username/password

### "Cannot find module" or Import errors
**Solution:** 
- Check build logs for TypeScript compilation errors
- Make sure all dependencies are in `package.json`

### "process.exit" or initialization errors
**Solution:** 
- The updated handler should handle this better now
- Still check logs for specific errors

## Quick Checklist

- [ ] Checked Vercel function logs for actual error
- [ ] Added `MONGODB_URI` in Vercel Environment Variables
- [ ] Added `NODE_ENV=production` in Vercel Environment Variables
- [ ] Set variables for Production environment (and Preview/Development)
- [ ] MongoDB Atlas network access allows 0.0.0.0/0
- [ ] MongoDB connection string is correct and includes password
- [ ] Redeployed after adding environment variables
- [ ] Tested `/health` endpoint

## Still Not Working?

1. **Share the error from Vercel logs** - This will help identify the exact issue
2. **Check if build succeeded** - Go to Deployments → Check build logs
3. **Verify environment variables are set** - Settings → Environment Variables → Make sure they show up

## Updated Handler

I've updated `api/index.ts` to:
- Handle health check without requiring database
- Better error handling
- Graceful degradation if database connection fails
- More detailed error messages in development mode

After you set the environment variables and redeploy, it should work!


