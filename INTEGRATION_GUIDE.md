# 🔗 CampusCare - Frontend & Backend Integration Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Integration](#step-by-step-integration)
4. [Environment Configuration](#environment-configuration)
5. [Running Both Servers](#running-both-servers)
6. [API Communication Flow](#api-communication-flow)
7. [Authentication Flow](#authentication-flow)
8. [Data Flow Examples](#data-flow-examples)
9. [Troubleshooting](#troubleshooting)
10. [Production Deployment](#production-deployment)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CampusCare System                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │   Frontend      │         │    Backend      │            │
│  │   (React)       │ ◄─────► │   (Express)     │            │
│  │                 │  HTTP   │                 │            │
│  │  Port: 8082     │  REST   │  Port: 5000     │            │
│  │                 │  API    │                 │            │
│  └─────────────────┘         └─────────────────┘            │
│         │                            │                       │
│         │ Axios                      │ Mongoose              │
│         ▼                            ▼                       │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │  localStorage   │         │    MongoDB      │            │
│  │  (JWT tokens)   │         │   (Database)    │            │
│  └─────────────────┘         └─────────────────┘            │
│                                      │                       │
│                                      │                       │
│                              ┌───────▼─────────┐             │
│                              │  Google Gemini  │             │
│                              │   (AI Chat)     │             │
│                              └─────────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Prerequisites

Before integrating, ensure you have:

- [x] **Node.js** v18+ installed
- [x] **MongoDB** (local or Atlas) running
- [x] **Google Gemini API Key**
- [x] Both `frontend/` and `backend/` folders set up

---

## 📖 Step-by-Step Integration

### Step 1: Clone/Navigate to Project

```bash
cd /path/to/campuscare
```

Your project structure should look like:
```
campuscare/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   ├── .env
│   └── package.json
└── README.md
```

---

### Step 2: Install Dependencies

#### Backend

```bash
cd backend
npm install
```

**Installs:**
- express
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- cors
- multer
- @google/generative-ai

#### Frontend

```bash
cd ../frontend
npm install
```

**Installs:**
- react
- react-router-dom
- axios
- tailwindcss
- framer-motion
- recharts
- lucide-react
- sonner

---

### Step 3: Configure Environment Variables

#### Backend `.env` (`backend/.env`)

```env
# MongoDB Connection (REQUIRED)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campuscare

# JWT Secret (REQUIRED - generate random string)
JWT_SECRET=your_super_secret_jwt_key_64_characters_long

# Gemini API Key (REQUIRED for AI chat)
GEMINI_API_KEY=AIzaSy...your_key_here

# Server Port (default: 5000)
PORT=5000

# Environment
NODE_ENV=development
```

**How to get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<password>` with your database password

**How to get Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

#### Frontend `.env` (`frontend/.env`)

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

**⚠️ Important:**
- In **development**: Use `http://localhost:5000`
- In **production**: Use your deployed backend URL (e.g., `https://api.campuscare.com`)

---

### Step 4: Verify Backend Configuration

#### Test MongoDB Connection

```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ MongoDB Connected')).catch(err => console.error('❌ Error:', err.message));"
```

Expected output: `✅ MongoDB Connected`

---

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected: cluster.mongodb.net
```

**Verify it's working:**
```bash
curl http://localhost:5000
```

Should return:
```json
{
  "success": true,
  "message": "🚀 CampusCare Backend is running"
}
```

---

### Step 6: Start Frontend Server

Open a **NEW terminal** (keep backend running):

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:8082/
  ➜  Network: use --host to expose
```

---

### Step 7: Test Integration

1. **Open browser:** `http://localhost:8082`
2. **Click "Get Started"** → Goes to `/auth`
3. **Register a new account:**
   - Name: Test User
   - Email: test@test.com
   - Password: password123
   - Role: Student
4. **Click "Sign Up"**
5. **Should auto-login and redirect to Dashboard**

**If successful:** ✅ Integration working!

---

## 🔧 Environment Configuration

### Development vs Production

#### Development Setup (Local)

**Backend `.env`:**
```env
MONGO_URI=mongodb://localhost:27017/campuscare  # Local MongoDB
PORT=5000
NODE_ENV=development
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

#### Production Setup (Deployed)

**Backend `.env`:**
```env
MONGO_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/campuscare
PORT=5000
NODE_ENV=production
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=https://api.campuscare.com
```

---

## ▶️ Running Both Servers

### Option 1: Two Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

### Option 2: Using `concurrently` (Single Terminal)

**Install in project root:**
```bash
npm install -D concurrently
```

**Add script to root `package.json`:**
```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm run preview"
  }
}
```

**Run both:**
```bash
npm run dev
```

---

## 🔄 API Communication Flow

### 1. User Login Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Frontend │                │ Backend  │                │ MongoDB  │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ POST /api/auth/login      │                           │
     │ {email, password}         │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │ Find user by email        │
     │                           ├──────────────────────────►│
     │                           │                           │
     │                           │◄──────────────────────────┤
     │                           │ User document             │
     │                           │                           │
     │                           │ Verify password (bcrypt)  │
     │                           │                           │
     │                           │ Generate JWT token        │
     │                           │                           │
     │ {token, user}             │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ Store in localStorage     │                           │
     │ Navigate to /dashboard    │                           │
     │                           │                           │
```

---

### 2. Protected API Call Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│ Frontend │                │ Backend  │                │ MongoDB  │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ GET /api/moods/history    │                           │
     │ Headers:                  │                           │
     │   Authorization: Bearer   │                           │
     │   <JWT token>             │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │ Verify JWT token          │
     │                           │ (authMiddleware)          │
     │                           │                           │
     │                           │ Find moods for user       │
     │                           ├──────────────────────────►│
     │                           │                           │
     │                           │◄──────────────────────────┤
     │                           │ Mood documents            │
     │                           │                           │
     │ {moods: [...]}            │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │ Display in UI             │                           │
     │                           │                           │
```

---

## 🔐 Authentication Flow

### How JWT Tokens Work

**1. User Logs In:**
```javascript
// Frontend (Auth.tsx)
const response = await authAPI.login(email, password);
// Response: { token: "eyJhbGc...", user: {...} }

// Store in localStorage
localStorage.setItem('campuscare_token', response.token);
```

**2. Frontend Sends Token:**
```javascript
// Frontend (services/api.ts)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campuscare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**3. Backend Verifies Token:**
```javascript
// Backend (middleware/authMiddleware.js)
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next(); // Proceed to controller
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

## 📊 Data Flow Examples

### Example 1: Log Mood

**Frontend:**
```tsx
const handleMoodLog = async () => {
  try {
    const response = await moodAPI.logMood('anxious', '😰', 'Stressed about exams');
    toast.success('Mood logged!');
  } catch (error) {
    toast.error('Failed to log mood');
  }
};
```

**API Call:**
```http
POST http://localhost:5000/api/moods
Content-Type: application/json
Authorization: Bearer eyJhbGc...

{
  "mood": "anxious",
  "emoji": "😰",
  "note": "Stressed about exams"
}
```

**Backend Controller:**
```javascript
exports.logMood = async (req, res) => {
  const { mood, emoji, note } = req.body;

  const moodEntry = await Mood.create({
    user: req.user._id,  // From JWT token
    mood,
    emoji,
    note
  });

  res.status(201).json({
    success: true,
    mood: moodEntry
  });
};
```

**Database:**
```javascript
// Stored in MongoDB
{
  _id: ObjectId("..."),
  user: ObjectId("507f1f77bcf86cd799439011"),
  mood: "anxious",
  emoji: "😰",
  note: "Stressed about exams",
  createdAt: "2026-01-02T10:30:00.000Z"
}
```

---

### Example 2: Upload Resource

**Frontend:**
```tsx
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', 'Meditation Video');
  formData.append('description', 'Guided meditation');
  formData.append('category', 'video');

  const response = await resourcesAPI.uploadResource(formData);
  toast.success('Video uploaded!');
};
```

**API Call:**
```http
POST http://localhost:5000/api/resources/upload
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGc...

Form Data:
  file: video.mp4
  title: Meditation Video
  description: Guided meditation
  category: video
```

**Backend Controller:**
```javascript
exports.uploadResource = async (req, res) => {
  const { title, description, category } = req.body;
  const file = req.file;  // Multer provides this

  const fileUrl = `/uploads/videos/${file.filename}`;

  const resource = await Resource.create({
    title,
    description,
    category,
    link: fileUrl,
    fileUrl,
    fileName: file.originalname,
    fileSize: file.size,
    isUploaded: true
  });

  res.status(201).json({
    success: true,
    resource
  });
};
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login'
from origin 'http://localhost:8082' has been blocked by CORS policy
```

**Solution:**

Backend `server.js` should have:
```javascript
const cors = require('cors');
app.use(cors());  // ✅ Must be before routes
```

---

### Issue 2: JWT Token Not Sent

**Error:** Backend returns `401 Not authorized`

**Check:**
1. Token is stored:
```javascript
console.log(localStorage.getItem('campuscare_token'));
```

2. Axios interceptor is configured:
```javascript
// services/api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campuscare_token');
  console.log('Sending token:', token);  // Debug
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### Issue 3: API Base URL Wrong

**Error:** `ERR_CONNECTION_REFUSED`

**Check Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:5000  ✅ Correct
VITE_API_BASE_URL=http://localhost:5000/ ❌ Extra slash
VITE_API_BASE_URL=localhost:5000         ❌ Missing http://
```

**Restart frontend after changing `.env`:**
```bash
# Kill frontend server (Ctrl+C)
npm run dev
```

---

### Issue 4: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError`

**Solutions:**

1. **Check connection string:**
```env
# ✅ Correct format
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campuscare

# ❌ Common mistakes
MONGO_URI=mongodb+srv://username@cluster.mongodb.net/campuscare  # Missing password
MONGO_URI=mongodb://localhost:27017/campuscare                    # Local MongoDB not running
```

2. **Whitelist IP in MongoDB Atlas:**
   - Go to Atlas dashboard
   - Network Access → Add IP Address
   - Allow from anywhere: `0.0.0.0/0` (dev only)

---

## 🚀 Production Deployment

### Deploy Backend (Render/Railway)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/campuscare.git
git push -u origin main
```

2. **Create account on [Render](https://render.com)**

3. **Create New Web Service:**
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables:**
   - `MONGO_URI`: Your production MongoDB URI
   - `JWT_SECRET`: Generate new secret
   - `GEMINI_API_KEY`: Your API key
   - `NODE_ENV`: `production`

5. **Deploy** → Get URL: `https://campuscare-backend.onrender.com`

---

### Deploy Frontend (Vercel/Netlify)

1. **Update Frontend `.env.production`:**
```env
VITE_API_BASE_URL=https://campuscare-backend.onrender.com
```

2. **Build locally to test:**
```bash
cd frontend
npm run build
npm run preview
```

3. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel
```

4. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_API_BASE_URL`: Your backend URL

5. **Deploy** → Get URL: `https://campuscare.vercel.app`

---

### Update CORS for Production

**Backend `server.js`:**
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:8082',                  // Dev
  'https://campuscare.vercel.app',          // Prod frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## ✅ Integration Checklist

- [ ] Backend `.env` configured with MongoDB URI, JWT secret, Gemini API key
- [ ] Frontend `.env` configured with correct API URL
- [ ] Both servers running (`localhost:5000` and `localhost:8082`)
- [ ] Can access `http://localhost:5000` and get success message
- [ ] Can access `http://localhost:8082` and see landing page
- [ ] Can register new user
- [ ] Can login and get redirected to dashboard
- [ ] Can log mood and see it in database
- [ ] Can send chat message and get AI response
- [ ] Can book appointment
- [ ] File uploads working (videos, PDFs)

---

## 🎉 Success!

Your frontend and backend are now fully integrated! Users can:
- ✅ Register and login
- ✅ Track moods with visualizations
- ✅ Chat with AI
- ✅ Book appointments
- ✅ Post in community forum
- ✅ View/upload resources
- ✅ Admins can view analytics

**Next Steps:**
- Add more features
- Improve UI/UX
- Add tests
- Deploy to production
- Monitor performance

**Happy Coding! 🚀**
