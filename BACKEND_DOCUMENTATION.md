# 🔧 CampusCare Backend Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Authorization](#authentication--authorization)
9. [File Upload System](#file-upload-system)
10. [Running the Server](#running-the-server)
11. [Testing](#testing)
12. [Deployment](#deployment)

---

## 📖 Overview

CampusCare Backend is a **Node.js/Express REST API** that powers a mental health support platform for students. It provides:

- 🔐 **User Authentication** (JWT-based)
- 💬 **AI Chat** (Gemini API integration)
- 📊 **Mood Tracking** with analytics
- 📅 **Appointment Booking** system
- 👥 **Community Forum**
- 📚 **Resource Library** (videos, audio, PDFs)
- 📈 **Admin Analytics** dashboard

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v18+ | Runtime environment |
| **Express.js** | v4.18+ | Web framework |
| **MongoDB** | v6+ | NoSQL database |
| **Mongoose** | v8+ | MongoDB ODM |
| **JWT** | v9+ | Authentication tokens |
| **bcryptjs** | v2.4+ | Password hashing |
| **Multer** | v1.4+ | File upload handling |
| **Google Gemini API** | v1+ | AI chat responses |
| **dotenv** | v16+ | Environment config |
| **CORS** | v2.8+ | Cross-origin requests |

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── chatController.js     # AI chat handling
│   ├── moodController.js     # Mood tracking
│   ├── appointmentController.js  # Appointments
│   ├── postController.js     # Forum posts
│   ├── resourceController.js # Resources + uploads
│   └── adminController.js    # Analytics
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   └── uploadMiddleware.js   # Multer file upload config
├── models/
│   ├── User.js              # User schema
│   ├── ChatMessage.js       # Chat history
│   ├── Mood.js              # Mood entries
│   ├── Appointment.js       # Appointment bookings
│   ├── ForumPost.js         # Forum posts + replies
│   └── Resource.js          # Resource library
├── routes/
│   ├── authRoutes.js        # /api/auth
│   ├── chatRoutes.js        # /api/chat
│   ├── moodRoutes.js        # /api/moods
│   ├── appointmentRoutes.js # /api/appointments
│   ├── postRoutes.js        # /api/posts
│   ├── resourceRoutes.js    # /api/resources
│   └── adminRoutes.js       # /api/admin
├── uploads/                 # Uploaded files
│   ├── videos/
│   ├── audio/
│   └── pdfs/
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
└── server.js               # Entry point
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn**

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

### Step 3: Configure Environment Variables

Edit `.env` with your credentials (see next section)

### Step 4: Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campuscare

# JWT Secret (generate a random 64-character string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Gemini API Key (get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### How to Get API Keys:

**MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string from "Connect" → "Connect your application"

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy and paste into `.env`

**JWT Secret:**
Generate a random string:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🗄️ Database Schema

### User Model (`models/User.js`)

```javascript
{
  name: String,              // Full name
  email: String (unique),    // Login email
  password: String (hashed), // bcrypt hashed
  role: String,              // 'student' | 'doctor' | 'admin'
  collegeId: String,         // Student ID number
  createdAt: Date,
  updatedAt: Date
}
```

### Mood Model (`models/Mood.js`)

```javascript
{
  user: ObjectId (ref: User),
  mood: String,              // 'happy' | 'okay' | 'down' | 'anxious'
  emoji: String,             // Emoji representation
  note: String (optional),   // Optional journal note
  actionsTaken: [String],    // Clicked suggestions
  createdAt: Date
}
```

### Appointment Model (`models/Appointment.js`)

```javascript
{
  student: ObjectId (ref: User),
  doctor: ObjectId (ref: User),
  date: String,              // ISO date string
  time: String,              // "10:00 AM"
  reason: String,
  status: String,            // 'pending' | 'approved' | 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

### ChatMessage Model (`models/ChatMessage.js`)

```javascript
{
  user: ObjectId (ref: User),
  message: String,           // User's message
  response: String,          // AI response
  createdAt: Date
}
```

### ForumPost Model (`models/ForumPost.js`)

```javascript
{
  content: String,
  author: ObjectId (ref: User),
  anonymous: Boolean,        // Hide author name
  replies: [{
    content: String,
    author: ObjectId (ref: User),
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Resource Model (`models/Resource.js`)

```javascript
{
  title: String,
  description: String,
  category: String,          // 'video' | 'audio' | 'pdf' | 'article' | etc.
  link: String,              // URL or file path
  fileUrl: String (optional),     // Uploaded file path
  fileName: String (optional),    // Original filename
  fileSize: Number (optional),    // Bytes
  isUploaded: Boolean,       // true if file, false if link
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Create new user account |
| POST | `/login` | ❌ | Login and get JWT token |
| GET | `/me` | ✅ | Get current user info |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@kiet.edu","password":"password"}'
```

**Example Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "student@kiet.edu",
    "role": "student"
  }
}
```

---

### Mood Tracking (`/api/moods`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Log mood with optional note |
| GET | `/history` | ✅ | Get mood history (last 30 days) |
| GET | `/stats?days=7` | ✅ | Get mood statistics |
| GET | `/insights` | ✅ | Get AI-generated insights |
| POST | `/track-action` | ✅ | Track clicked suggestion |

**Example: Log Mood**
```bash
curl -X POST http://localhost:5000/api/moods \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"mood":"anxious","emoji":"😰","note":"Stressed about exams"}'
```

---

### Appointments (`/api/appointments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create appointment (student) |
| GET | `/student` | ✅ | Get student's appointments |
| GET | `/doctor` | ✅ | Get doctor's appointments |
| PATCH | `/:id/status` | ✅ | Update status (doctor) |

**Example: Book Appointment**
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "doctorId":"507f1f77bcf86cd799439011",
    "date":"2026-01-15",
    "time":"10:00 AM",
    "reason":"Feeling anxious"
  }'
```

---

### AI Chat (`/api/chat`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send` | ✅ | Send message, get AI response |
| GET | `/history` | ✅ | Get chat history |

**Example: Chat**
```bash
curl -X POST http://localhost:5000/api/chat/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"I am feeling stressed about exams"}'
```

---

### Forum Posts (`/api/posts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | Get all posts (sorted by newest) |
| POST | `/` | ✅ | Create new post |
| POST | `/:id/reply` | ✅ | Reply to post |

---

### Resources (`/api/resources`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | ✅ | Get all resources |
| POST | `/upload` | ✅ | Upload file (video/audio/PDF) |
| POST | `/` | ✅ | Create resource (link) |
| DELETE | `/:id` | ✅ | Delete resource |

**Example: Upload Video**
```bash
curl -X POST http://localhost:5000/api/resources/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@video.mp4" \
  -F "title=Stress Management" \
  -F "description=Learn stress techniques" \
  -F "category=video"
```

---

### Admin Analytics (`/api/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/overview` | ✅ | Dashboard overview stats |
| GET | `/mood-analytics?days=30` | ✅ | Mood analytics (anonymous) |
| GET | `/chat-insights` | ✅ | Chat usage stats |
| GET | `/peak-usage` | ✅ | Peak activity times |
| GET | `/forum-activity` | ✅ | Forum engagement |
| GET | `/appointment-trends` | ✅ | Appointment statistics |

---

## 🔐 Authentication & Authorization

### How JWT Works:

1. **User logs in** → Backend verifies credentials
2. **Backend generates JWT** → Includes user ID and role
3. **Token sent to client** → Client stores in localStorage
4. **Client includes token** → In Authorization header for protected routes
5. **Backend verifies token** → Using `authMiddleware.js`

### Middleware (`middleware/authMiddleware.js`)

```javascript
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Role-Based Access:

- **Student**: Can log moods, book appointments, use chat
- **Doctor**: Can view/manage appointments
- **Admin**: Can view analytics, manage resources

---

## 📤 File Upload System

### Configuration (`middleware/uploadMiddleware.js`)

```javascript
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, 'uploads/videos');
    } else if (file.mimetype.startsWith('audio/')) {
      cb(null, 'uploads/audio');
    } else if (file.mimetype === 'application/pdf') {
      cb(null, 'uploads/pdfs');
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.random() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['video/', 'audio/', 'application/pdf'];
    if (allowed.some(type => file.mimetype.includes(type))) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
```

### Serving Static Files

```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

Files accessible at: `http://localhost:5000/uploads/videos/filename.mp4`

---

## ▶️ Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

Uses **nodemon** to restart on file changes.

### Production Mode

```bash
npm start
```

### Scripts in `package.json`

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🧪 Testing

### Manual Testing with cURL

Test authentication:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@test.com",
    "password":"password123",
    "role":"student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Using Postman

1. Import collection with all endpoints
2. Set environment variable `baseUrl` = `http://localhost:5000`
3. Store JWT token after login
4. Use `{{token}}` in Authorization header

---

## 🚀 Deployment

### Environment Setup

1. **Set `NODE_ENV=production`** in `.env`
2. **Use production MongoDB** (not local)
3. **Generate new JWT_SECRET** (different from dev)
4. **Configure CORS** for frontend domain

### Deploy to Render/Railway/Heroku

1. **Create account** on deployment platform
2. **Connect GitHub repository**
3. **Set environment variables** in dashboard
4. **Deploy** from `main` branch

### Example: Render Deployment

```yaml
# render.yaml
services:
  - type: web
    name: campuscare-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: GEMINI_API_KEY
        sync: false
```

---

## 📝 Additional Scripts

### Reset Passwords

```bash
node resetPasswords.js
```

Resets all users to password `"password"` for testing.

### Get Doctor IDs

```bash
node getDoctorIds.js
```

Lists all doctor accounts with their MongoDB IDs.

---

## 🔧 Common Issues

### Issue: MongoDB Connection Failed

**Solution:**
- Check `MONGO_URI` in `.env`
- Whitelist your IP in MongoDB Atlas
- Ensure database user has permissions

### Issue: JWT Token Expired

**Solution:**
- Tokens expire after 7 days by default
- User must login again to get new token

### Issue: File Upload Fails

**Solution:**
- Check `uploads/` directory exists
- Verify file size < 100MB
- Ensure correct MIME type

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Multer Guide](https://github.com/expressjs/multer)

---

## 👥 Support

For issues or questions, contact the development team or check the project repository.

**Backend Ready! ✅**
