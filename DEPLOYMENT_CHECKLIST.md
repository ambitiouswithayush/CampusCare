# ✅ Vercel Deployment Checklist

## Before You Start

- [ ] GitHub repository is up to date
- [ ] MongoDB Atlas account created
- [ ] Google Gemini API key ready
- [ ] Vercel account created

---

## Step-by-Step Deployment

### 1. Prepare MongoDB Atlas

- [ ] Create MongoDB Atlas cluster (free tier)
- [ ] Create database user
- [ ] Get connection string
- [ ] Whitelist IP: `0.0.0.0/0` (allow from anywhere)

### 2. Deploy Backend First

**Go to Vercel Dashboard:**

- [ ] Click "Add New" → "Project"
- [ ] Import: `ambitiouswithayush/CampusCare`
- [ ] Root Directory: `backend`
- [ ] Framework: `Other`
- [ ] Build Command: `npm install`

**Add Environment Variables:**

- [ ] `MONGO_URI` = (your MongoDB connection string)
- [ ] `JWT_SECRET` = (generate new one: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] `GEMINI_API_KEY` = (your Gemini API key)
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = (leave empty for now, add after frontend deployment)

- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] **Copy backend URL** (e.g., `https://campuscare-api.vercel.app`)
- [ ] Test backend: Visit `https://your-backend-url.vercel.app/` (should show "Backend is running")

### 3. Update Frontend Configuration

- [ ] Edit `frontend/.env.production`
- [ ] Set `VITE_API_BASE_URL=https://your-backend-url.vercel.app`
- [ ] Commit and push changes:
```bash
git add frontend/.env.production backend/server.js backend/vercel.json
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 4. Deploy Frontend

**Go to Vercel Dashboard:**

- [ ] Click "Add New" → "Project"
- [ ] Import: `ambitiouswithayush/CampusCare` (same repo)
- [ ] Root Directory: `frontend`
- [ ] Framework: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

**Add Environment Variables:**

- [ ] `VITE_API_BASE_URL` = `https://your-backend-url.vercel.app`

- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] **Copy frontend URL** (e.g., `https://campuscare.vercel.app`)

### 5. Update Backend CORS

- [ ] Go to backend project on Vercel
- [ ] Settings → Environment Variables
- [ ] Add `FRONTEND_URL` = `https://your-frontend-url.vercel.app`
- [ ] Redeploy backend (Deployments tab → click "..." → Redeploy)

### 6. Test Your Deployed App

- [ ] Visit your frontend URL
- [ ] Test login with: `admin@campuscare.edu` / `password`
- [ ] Test student dashboard
- [ ] Test AI chat
- [ ] Test appointments
- [ ] Test admin dashboard

### 7. Post-Deployment

- [ ] Update GitHub README with live URL
- [ ] Share your app URL
- [ ] Monitor Vercel analytics
- [ ] Check for errors in Vercel logs

---

## 🔑 Environment Variables Reference

### Backend (.env):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campuscare
JWT_SECRET=your_very_long_random_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
FRONTEND_URL=https://campuscare.vercel.app
```

### Frontend (.env.production):
```
VITE_API_BASE_URL=https://campuscare-api.vercel.app
```

---

## 🐛 Troubleshooting

**Backend not working?**
- Check Vercel logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

**Frontend can't connect to backend?**
- Check CORS configuration
- Verify `VITE_API_BASE_URL` is correct
- Check browser console for errors

**Database errors?**
- MongoDB Atlas IP whitelist: `0.0.0.0/0`
- Check database user permissions
- Verify connection string format

---

## 📞 Your Deployment URLs

**Backend API:**
```
https://___________________.vercel.app
```

**Frontend App:**
```
https://___________________.vercel.app
```

Fill these in after deployment!

---

**Ready to deploy? Follow the checklist step-by-step! 🚀**
