# 🚀 Vercel Deployment Guide for CampusCare

Complete step-by-step guide to deploy both frontend and backend on Vercel.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account with your code pushed
- ✅ Vercel account (free tier works!)
- ✅ MongoDB Atlas account (for production database)
- ✅ Google Gemini API key

---

## 🎯 Deployment Strategy

We'll use **TWO separate Vercel projects**:

1. **Backend API** - Serverless functions for Express.js
2. **Frontend App** - Static React app

This separation provides:
- ✅ Better performance
- ✅ Independent scaling
- ✅ Clearer organization
- ✅ Easier debugging

---

## Part 1️⃣: Deploy Backend (API)

### Step 1: Create Backend Project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `ambitiouswithayush/CampusCare`
4. Click **"Import"**

### Step 2: Configure Backend Settings

In the project configuration:

**Root Directory:**
```
backend
```

**Framework Preset:**
```
Other
```

**Build Command:**
```
npm install
```

**Output Directory:**
```
.
```

**Install Command:**
```
npm install
```

### Step 3: Set Environment Variables

Click **"Environment Variables"** and add these:

| Key | Value | Where to get it |
|-----|-------|-----------------|
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your_jwt_secret` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `GEMINI_API_KEY` | `your_gemini_key` | Google AI Studio |
| `NODE_ENV` | `production` | - |

**Important:** Use a **different JWT_SECRET** than your local development!

### Step 4: Add vercel.json for Backend

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Step 5: Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://campuscare-backend.vercel.app`
4. **Save this URL** - you'll need it for the frontend!

### Step 6: Test Backend API

Test your backend:
```bash
curl https://your-backend-url.vercel.app/api
```

Should return: `{"message":"🚀 CampusCare Backend is running"}`

---

## Part 2️⃣: Deploy Frontend

### Step 1: Update Frontend Environment

Before deploying frontend, update the API URL:

Create/update `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

**Replace** `your-backend-url.vercel.app` with your actual backend URL from Part 1!

### Step 2: Push Changes to GitHub

```bash
git add frontend/.env.production
git commit -m "Add production environment config"
git push origin main
```

### Step 3: Create Frontend Project on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import same repository: `ambitiouswithayush/CampusCare`
4. Click **"Import"**

### Step 4: Configure Frontend Settings

**Root Directory:**
```
frontend
```

**Framework Preset:**
```
Vite
```

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

### Step 5: Set Environment Variables

Add this environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend-url.vercel.app` |

### Step 6: Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. You'll get a URL like: `https://campuscare.vercel.app`

---

## 3️⃣: Configure CORS for Backend

Your backend needs to allow requests from your frontend domain.

### Update backend/server.js

```javascript
const cors = require('cors');

// CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:8083',           // Local development
    'https://campuscare.vercel.app',   // Your frontend URL
    'https://*.vercel.app'              // All Vercel preview deployments
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

Push this change:
```bash
git add backend/server.js
git commit -m "Configure CORS for production"
git push origin main
```

Vercel will auto-redeploy your backend!

---

## 4️⃣: File Upload Consideration

⚠️ **Important:** Vercel's serverless functions are **ephemeral** (temporary), so uploaded files won't persist.

### Solution Options:

**Option A: Use Cloud Storage (Recommended)**
- AWS S3
- Cloudinary
- Vercel Blob Storage

**Option B: Disable Uploads for Now**
- Comment out upload routes
- Use only external links for resources

**For this deployment, we'll use Option B** to get you running quickly.

---

## 5️⃣: Test Your Deployed App

1. Go to your frontend URL: `https://campuscare.vercel.app`
2. Try logging in with test accounts
3. Test all features:
   - ✅ Login/Register
   - ✅ Mood tracking
   - ✅ AI Chat
   - ✅ Appointments
   - ✅ Community forum
   - ✅ Admin dashboard

---

## 6️⃣: Custom Domain (Optional)

### Add Custom Domain

1. Go to your frontend project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `campuscare.com`)
4. Follow Vercel's DNS configuration instructions

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"

**Solution:**
1. Check `VITE_API_BASE_URL` is correct in frontend env vars
2. Verify CORS is configured in backend
3. Check backend deployment logs in Vercel dashboard

### Issue: "Database connection failed"

**Solution:**
1. Verify `MONGO_URI` is correct
2. Check MongoDB Atlas network access (allow `0.0.0.0/0` for Vercel)
3. Ensure database user has read/write permissions

### Issue: "Authentication not working"

**Solution:**
1. Verify `JWT_SECRET` is set in backend environment
2. Check browser console for CORS errors
3. Ensure cookies/localStorage work (not blocked)

### Issue: "API returns 404"

**Solution:**
1. Check backend `vercel.json` routes configuration
2. Verify all API routes start with `/api`
3. Check Vercel deployment logs

---

## 📊 Monitor Your Deployment

### Vercel Dashboard

Monitor these metrics:
- **Analytics**: Page views, user sessions
- **Logs**: Runtime errors, API calls
- **Performance**: Load times, response times

### MongoDB Atlas

Monitor:
- **Database size**: Free tier has 512MB limit
- **Connections**: Free tier allows 500 concurrent connections
- **Operations**: Query performance

---

## 🔒 Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Enable MongoDB Atlas IP whitelist (if needed)
- [ ] Review CORS origins (only allow your domains)
- [ ] Add rate limiting for API endpoints
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Don't commit `.env` files

---

## 💰 Cost Breakdown

**Free Tier Limits:**

| Service | Free Tier | Enough for? |
|---------|-----------|-------------|
| Vercel (Frontend) | 100GB bandwidth/month | 10,000+ users/month |
| Vercel (Backend) | 100GB-hrs serverless/month | 50,000+ API calls/month |
| MongoDB Atlas | 512MB storage | 50,000+ students |
| Google Gemini | 60 requests/min | 86,000+ chats/day |

**Total Cost: $0/month** for moderate usage!

---

## 🎉 Next Steps

After successful deployment:

1. **Share your app**: `https://campuscare.vercel.app`
2. **Add custom domain** (optional)
3. **Monitor usage** via Vercel dashboard
4. **Implement cloud storage** for file uploads
5. **Add analytics** (Google Analytics, Vercel Analytics)
6. **Set up monitoring** (Sentry for error tracking)

---

## 📚 Useful Commands

**Redeploy specific project:**
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

**View deployment logs:**
```bash
vercel logs <deployment-url>
```

**Pull environment variables:**
```bash
vercel env pull
```

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- GitHub Issues: https://github.com/ambitiouswithayush/CampusCare/issues

---

**Happy Deploying! 🚀**

Your CampusCare platform will be live and helping students worldwide!
