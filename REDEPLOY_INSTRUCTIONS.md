# How to Redeploy on Vercel

## Method 1: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click on your project
3. Go to the **"Deployments"** tab
4. Find your latest deployment
5. Click the **three dots (⋯)** menu on the right
6. Click **"Redeploy"**
7. Confirm the redeployment

That's it! Vercel will rebuild and redeploy your project.

---

## Method 2: Via Git Push (Automatic)

If you've made code changes and want to redeploy:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment"
   git push
   ```

2. **Vercel will automatically redeploy** when you push to your main/master branch

---

## Method 3: Via Vercel CLI

1. **Make sure you're logged in:**
   ```bash
   vercel login
   ```

2. **Redeploy to production:**
   ```bash
   vercel --prod
   ```

   Or for preview:
   ```bash
   vercel
   ```

---

## After Redeploying

1. **Wait for build to complete** (usually 1-3 minutes)
2. **Check the deployment status** in Vercel Dashboard
3. **Test your API:**
   - Health check: `https://your-project.vercel.app/health`
   - Your API endpoints: `https://your-project.vercel.app/api/...`

---

## Important Notes

- **Environment Variables**: If you added/updated environment variables, you need to redeploy for them to take effect
- **Build Time**: First deployment takes longer, subsequent ones are faster
- **Check Logs**: If deployment fails, check the build logs in Vercel Dashboard

---

## Quick Commands Reference

```bash
# Redeploy to production
vercel --prod

# Create preview deployment
vercel

# View logs
vercel logs

# List deployments
vercel ls
```


