# Troubleshooting Vercel Deployment

## Common Issues and Solutions

### Issue 1: Serverless Function Crashed (500 Error)

**Symptoms:**
- Deployment succeeds but function returns 500 error
- Error: "FUNCTION_INVOCATION_FAILED"

**Solutions:**

1. **Check Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure `MONGODB_URI` is set correctly
   - Ensure `NODE_ENV` is set to `production`
   - Make sure variables are added for **Production** environment

2. **Check Function Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the failed deployment
   - Click "Functions" tab
   - Check the error logs

3. **Common Causes:**
   - Missing `MONGODB_URI` environment variable
   - Invalid MongoDB connection string
   - MongoDB Atlas network access not configured (needs to allow Vercel IPs or 0.0.0.0/0)
   - TypeScript compilation errors

### Issue 2: Environment Variables Not Set

**Solution:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `MONGODB_URI` = `your-mongodb-connection-string`
   - `NODE_ENV` = `production`
   - `LOG_LEVEL` = `info` (optional)
5. Redeploy after adding variables

### Issue 3: MongoDB Connection Fails

**Solutions:**

1. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allows all IPs) OR add Vercel's IP ranges
   - Click "Add IP Address"

2. **Verify Connection String**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - Make sure username and password are URL-encoded if they contain special characters
   - Test the connection string locally first

3. **Check MongoDB User Permissions**
   - Ensure the MongoDB user has read/write permissions

### Issue 4: Build Fails

**Solutions:**

1. **Check Build Logs**
   - Go to Vercel Dashboard → Deployments → Click on failed deployment
   - Check build logs for errors

2. **Common Build Issues:**
   - Missing dependencies (move from devDependencies to dependencies if needed at runtime)
   - TypeScript errors (run `npm run build` locally to check)
   - Missing files or incorrect paths

3. **Fix:**
   ```bash
   # Test build locally
   npm run build
   
   # If it fails, fix the errors
   # Then commit and push to trigger new deployment
   ```

### Issue 5: CORS Errors

**Solution:**
Update `src/app.ts` to include your frontend domain:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://your-frontend-domain.vercel.app', // Add your frontend
  'https://your-backend-domain.vercel.app',  // Add your backend if needed
];
```

### Issue 6: Function Timeout

**Solutions:**

1. **Optimize Database Queries**
   - Add indexes to frequently queried fields
   - Use pagination for large datasets
   - Optimize aggregation pipelines

2. **Increase Timeout (if needed)**
   - Vercel Pro plan allows up to 60s timeout
   - Free plan has 10s timeout limit

### Issue 7: Import/Path Errors

**Symptoms:**
- "Cannot find module" errors
- Path resolution errors

**Solutions:**

1. **Check tsconfig.json**
   - Ensure `api` folder is included
   - Verify `moduleResolution` is set to `node`

2. **Check Import Paths**
   - Use relative paths: `../src/app`
   - Not absolute paths from dist

### Quick Debugging Steps

1. **Check Logs:**
   ```bash
   vercel logs
   ```

2. **Test Locally with Vercel:**
   ```bash
   vercel dev
   ```

3. **Verify Environment Variables:**
   - Check in Vercel Dashboard
   - Verify they're set for the correct environment (Production/Preview)

4. **Test Database Connection:**
   - Test MongoDB connection string locally
   - Verify network access in MongoDB Atlas

5. **Check Build Output:**
   - Run `npm run build` locally
   - Check if `dist/` folder is created correctly
   - Verify all files are compiled

## Getting Help

1. **Check Vercel Logs:**
   - Dashboard → Project → Deployments → Functions tab

2. **Check Build Logs:**
   - Dashboard → Project → Deployments → Build logs

3. **Vercel Support:**
   - Documentation: https://vercel.com/docs
   - Discord: https://vercel.com/discord

4. **Common Error Messages:**
   - `FUNCTION_INVOCATION_FAILED` → Check function logs
   - `BUILD_FAILED` → Check build logs
   - `ENOENT` → Missing file or incorrect path
   - `MODULE_NOT_FOUND` → Missing dependency or incorrect import

