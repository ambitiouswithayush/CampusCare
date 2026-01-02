# 🎨 CampusCare Frontend Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Pages & Components](#pages--components)
6. [Routing](#routing)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Styling & Theming](#styling--theming)
10. [Running the App](#running-the-app)
11. [Building for Production](#building-for-production)
12. [Deployment](#deployment)

---

## 📖 Overview

CampusCare Frontend is a **React + TypeScript SPA** (Single Page Application) that provides students with mental health support tools including mood tracking, AI chat, community forum, and resource library.

**Key Features:**
- 🎭 **Mood Tracking** with visualizations
- 💬 **AI-Powered Chat** for support
- 📅 **Appointment Booking** with counselors
- 👥 **Anonymous Community Forum**
- 📚 **Resource Library** (videos, PDFs, audio)
- 📊 **Admin Analytics Dashboard**
- 🌙 **Dark/Light Mode** support
- 📱 **Fully Responsive** design

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v18+ | UI library |
| **TypeScript** | v5+ | Type safety |
| **Vite** | v5+ | Build tool & dev server |
| **React Router** | v6+ | Client-side routing |
| **Axios** | v1+ | HTTP client |
| **Tailwind CSS** | v3+ | Utility-first CSS |
| **Framer Motion** | v11+ | Animations |
| **Recharts** | v2+ | Data visualizations |
| **Lucide React** | v0.3+ | Icons |
| **Sonner** | v1+ | Toast notifications |
| **date-fns** | v3+ | Date formatting |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── campuscare-logo.svg     # App logo
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── card.tsx
│   │   ├── mood/               # Mood tracking components
│   │   │   ├── MoodJournalDialog.tsx
│   │   │   ├── MoodTrendsWidget.tsx
│   │   │   └── MoodInsightsWidget.tsx
│   │   └── resources/          # Resource library components
│   │       ├── ResourceViewer.tsx
│   │       └── ResourceUploadDialog.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── pages/
│   │   ├── Index.tsx           # Landing page
│   │   ├── Auth.tsx            # Login/Register
│   │   ├── Dashboard.tsx       # Student dashboard
│   │   ├── DoctorDashboard.tsx # Doctor dashboard
│   │   ├── AdminDashboard.tsx  # Admin analytics
│   │   ├── Chat.tsx            # AI chat
│   │   ├── Community.tsx       # Forum
│   │   ├── Resources.tsx       # Resource library
│   │   └── Appointments.tsx    # Appointment booking
│   ├── services/
│   │   └── api.ts              # API client
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   ├── index.css               # Global styles
│   └── vite-env.d.ts           # TypeScript types
├── .env                        # Environment variables
├── .env.example                # Environment template
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript config
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

### Step 3: Configure Environment

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Step 4: Start Development Server

```bash
npm run dev
```

App will run on `http://localhost:8082`

---

## 🌐 Pages & Components

### 1. Landing Page (`pages/Index.tsx`)

**Route:** `/`

**Features:**
- Hero section with call-to-action
- Feature highlights
- Get started button → `/auth`

**Key Components:**
```tsx
<Hero />
<Features />
<CallToAction />
```

---

### 2. Authentication (`pages/Auth.tsx`)

**Route:** `/auth`

**Features:**
- Login form
- Register form with role selection
- Form validation
- Auto-redirect based on role:
  - Student → `/dashboard`
  - Doctor → `/doctor`
  - Admin → `/admin`

**Code Example:**
```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await authAPI.login(email, password);
    login(response.token, response.user);

    // Role-based redirect
    if (response.user.role === 'admin') {
      navigate('/admin');
    } else if (response.user.role === 'doctor') {
      navigate('/doctor');
    } else {
      navigate('/dashboard');
    }
  } catch (error) {
    toast.error('Invalid credentials');
  }
};
```

---

### 3. Student Dashboard (`pages/Dashboard.tsx`)

**Route:** `/dashboard`

**Features:**
- Mood tracking section (4 emoji buttons)
- Quick access cards (Chat, Community, Resources, Appointments)
- Mood trends chart (7-day bar chart)
- Mood insights widget (AI-generated)
- Recent activity feed

**Key Components:**
```tsx
<MoodJournalDialog />        // Popup when clicking mood emoji
<MoodTrendsWidget />         // Bar chart visualization
<MoodInsightsWidget />       // AI insights panel
<QuickAccessCards />         // Navigation cards
```

---

### 4. AI Chat (`pages/Chat.tsx`)

**Route:** `/chat`

**Features:**
- Real-time AI chat (Gemini API)
- Chat history
- Suggested prompts
- Typing indicators
- Message bubbles with timestamps

**Code Example:**
```tsx
const sendMessage = async () => {
  try {
    setIsLoading(true);
    const response = await chatAPI.sendMessage(message);

    setMessages([
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: response.response }
    ]);

    setMessage('');
  } catch (error) {
    toast.error('Failed to send message');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 5. Community Forum (`pages/Community.tsx`)

**Route:** `/community`

**Features:**
- Create anonymous posts
- Reply to posts
- Real-time updates
- Privacy-focused (usernames hidden if anonymous)

---

### 6. Resource Library (`pages/Resources.tsx`)

**Route:** `/resources`

**Features:**
- Filter by category (Videos, Audio, PDFs, Articles)
- Search functionality
- Embedded media viewer (modal)
- Video player (YouTube + uploaded)
- Audio player
- PDF viewer
- Download button for uploaded files

**Key Components:**
```tsx
<ResourceViewer />          // Modal with media player
<ResourceUploadDialog />    // Admin upload form
```

---

### 7. Appointments (`pages/Appointments.tsx`)

**Route:** `/appointments`

**Features:**
- Book appointments with counselors
- Select date and time
- Add reason for appointment
- View appointment status

---

### 8. Doctor Dashboard (`pages/DoctorDashboard.tsx`)

**Route:** `/doctor`

**Features:**
- View appointment requests
- Approve/Reject appointments
- Filter by status (Pending, Approved, Rejected)
- Statistics cards

**Key Functions:**
```tsx
const handleApprove = async (appointmentId: string) => {
  await appointmentsAPI.updateAppointmentStatus(appointmentId, 'approved');
  toast.success('Appointment approved');
  loadAppointments();
};
```

---

### 9. Admin Dashboard (`pages/AdminDashboard.tsx`)

**Route:** `/admin`

**Features:**
- **Overview Stats**: Total users, chat messages, forum posts
- **Mood Analytics**: Pie chart, engagement metrics
- **Chat Insights**: Most discussed topics
- **Peak Usage**: Activity heatmap
- **Forum Activity**: Engagement trends
- **Appointment Trends**: Booking statistics

**Visualizations:**
```tsx
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={moodData} dataKey="value" nameKey="name" />
  </PieChart>
</ResponsiveContainer>
```

---

## 🧭 Routing

### Routes Configuration (`App.tsx`)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/chat" element={<Chat />} />
    <Route path="/community" element={<Community />} />
    <Route path="/resources" element={<Resources />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/doctor" element={<DoctorDashboard />} />
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
</BrowserRouter>
```

### Protected Routes

Each page checks authentication:

```tsx
useEffect(() => {
  if (!user) {
    navigate('/auth');
  } else if (user.role !== 'student') {
    navigate('/dashboard');
  }
}, [user, navigate]);
```

---

## 🔄 State Management

### Auth Context (`contexts/AuthContext.tsx`)

**Global State:**
- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Boolean

**Methods:**
- `login(token, user)`: Store credentials
- `logout()`: Clear credentials
- `updateUser(user)`: Update user info

**Usage:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};
```

**Implementation:**
```tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campuscare_token'));

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('campuscare_token', token);
    localStorage.setItem('campuscare_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campuscare_token');
    localStorage.removeItem('campuscare_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🔌 API Integration

### API Client (`services/api.ts`)

**Axios Instance:**
```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor (add JWT token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campuscare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campuscare_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

**API Methods:**

```tsx
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
  }
};

export const moodAPI = {
  logMood: async (mood: string, emoji: string, note?: string) => {
    const { data } = await api.post('/moods', { mood, emoji, note });
    return data;
  },
  getMoodHistory: async () => {
    const { data } = await api.get('/moods/history');
    return data;
  }
};

export const chatAPI = {
  sendMessage: async (message: string) => {
    const { data } = await api.post('/chat/send', { message });
    return data;
  }
};
```

---

## 🎨 Styling & Theming

### Tailwind CSS Configuration

**Custom Colors** (`tailwind.config.js`):

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        healing: '#4CAF50',         // Green (calming)
        'healing-light': '#E8F5E9',
        lavender: '#9C27B0',        // Purple (mindfulness)
        'lavender-light': '#F3E5F5',
        sunrise: '#FF9800',         // Orange (energy)
        'sunrise-light': '#FFF3E0',
        crisis: '#F44336',          // Red (urgency)
        'crisis-light': '#FFEBEE',
      }
    }
  }
};
```

### Using Custom Styles

```tsx
// Healing green button
<Button className="bg-healing hover:bg-healing/90">
  Start Chat
</Button>

// Lavender card
<div className="bg-lavender-light p-6 rounded-3xl">
  Meditation Resources
</div>
```

### Animation with Framer Motion

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <Card />
</motion.div>
```

---

## ▶️ Running the App

### Development Mode

```bash
npm run dev
```

- Runs on `http://localhost:8082`
- Hot module replacement (HMR)
- Fast refresh

### Preview Production Build

```bash
npm run build
npm run preview
```

### Scripts in `package.json`

```json
{
  "scripts": {
    "dev": "vite --port 8082",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

---

## 📦 Building for Production

### Build Command

```bash
npm run build
```

**Output:** `dist/` folder

### Build Optimizations

Vite automatically:
- ✅ Minifies JavaScript/CSS
- ✅ Tree-shakes unused code
- ✅ Code splits routes
- ✅ Optimizes images
- ✅ Generates source maps

### Build Size

Typical production build:
- **JS Bundle**: ~300KB (gzipped)
- **CSS**: ~50KB (gzipped)
- **Total**: < 500KB

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables in Production

Set in deployment platform dashboard:

```
VITE_API_BASE_URL=https://your-backend.com
```

---

## 🧩 Component Examples

### Mood Tracking Dialog

```tsx
<MoodJournalDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  selectedMood={selectedMood}
  onSubmit={async (note) => {
    await moodAPI.logMood(selectedMood.mood, selectedMood.emoji, note);
    toast.success('Mood logged!');
  }}
/>
```

### Resource Viewer

```tsx
<ResourceViewer
  resource={{
    title: 'Stress Management',
    category: 'video',
    link: 'https://youtube.com/watch?v=...',
    description: 'Learn stress techniques'
  }}
  onClose={() => setSelectedResource(null)}
/>
```

### Toast Notifications

```tsx
import { toast } from 'sonner';

toast.success('Appointment booked!');
toast.error('Failed to load data');
toast.loading('Uploading file...');
```

---

## 🔧 Common Issues

### Issue: API Calls Fail (CORS Error)

**Solution:**
- Check `VITE_API_BASE_URL` in `.env`
- Ensure backend has CORS enabled
- Verify backend is running

### Issue: White Screen After Build

**Solution:**
- Check browser console for errors
- Verify all routes are properly configured
- Ensure environment variables are set

### Issue: Images Not Loading

**Solution:**
- Place images in `public/` folder
- Reference as `/image.png` (not `./image.png`)

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)

---

**Frontend Ready! ✅**
