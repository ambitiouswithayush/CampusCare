# 🏥 CampusCare - Mental Health Support Platform
DEPLOYED LINK:https://campus-care-sigma.vercel.app
<div align="center">

![CampusCare](https://img.shields.io/badge/CampusCare-Mental%20Health-4CAF50?style=for-the-badge&logo=heart&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A comprehensive mental health support platform designed for students to track moods, access AI-powered chat support, book counseling appointments, and engage with a supportive community.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Documentation](#-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About

**CampusCare** is a full-stack mental health platform specifically designed for educational institutions. It provides students with tools to:

- 📊 **Track their mental wellbeing** through daily mood logging with AI-powered insights
- 💬 **Chat with AI** for immediate mental health support and guidance
- 📅 **Book appointments** with campus counselors seamlessly
- 👥 **Connect anonymously** with peers in a supportive community forum
- 📚 **Access resources** including videos, audio guides, and educational PDFs
- 📈 **View analytics** (for administrators) to understand campus-wide mental health trends

Built with privacy and accessibility in mind, CampusCare empowers students to take control of their mental health journey while providing institutions with valuable (anonymized) insights.

---

## ✨ Features

### 🎭 For Students

#### Mood Tracking
- **Daily Mood Logging**: Track emotions with intuitive emoji-based interface (😊 Happy, 😐 Okay, 😔 Down, 😰 Anxious)
- **Mood Journal**: Optional private notes for each mood entry (500 characters max)
- **Visual Trends**: Interactive 7-day bar chart showing mood patterns
- **AI Insights**: Personalized suggestions and pattern recognition
- **Action Tracking**: System tracks which suggestions you click for better recommendations

#### AI-Powered Chat (RAG-based)
- **24/7 Support**: Instant responses powered by Google Gemini AI
- **Context-Aware**: AI understands mental health context and provides appropriate guidance
- **Retrieval-Augmented Generation**: Every resource in the library is embedded (Gemini `gemini-embedding-001`); each chat message is embedded and matched via cosine similarity, so the AI recommends *actual* resources from the library instead of generic advice
- **Grounded Recommendations**: The AI is only allowed to cite resources that were actually retrieved, preventing hallucinated links
- **Chat History**: Review past conversations for continuity
- **Crisis Keyword Detection**: Flags high-risk language and immediately shows a crisis helpline

#### Real-Time Notifications
- **Live Updates via Socket.IO**: Appointment approvals, forum replies, and campus-wide announcements arrive instantly, no page refresh needed
- **Notification Bell**: Persisted notification history in the dashboard header with unread badges, separate from ephemeral toasts

#### Smart Appointment Booking
- **Rule-Based Counselor Matching**: Instead of picking any counselor, students select a concern type (anxiety, career, depression, etc.) and get matched by specialization, current caseload, and continuity of care (whether they've seen that counselor before)
- **Date & Time Selection**: Choose from available slots
- **Reason Input**: Provide context for your appointment
- **Live Status Tracking**: Appointment status changes (Pending/Approved/Rejected) push instantly via WebSocket, plus a notification bell entry

#### Community Forum
- **Anonymous Posting**: Share experiences without revealing identity
- **Peer Support**: Connect with students facing similar challenges
- **Threaded Replies**: Engage in meaningful conversations
- **Safe Space**: Privacy-first design with optional anonymity

#### Resource Library
- **Video Tutorials**: Guided meditation, stress management techniques
- **Audio Content**: Relaxation exercises, sleep aids
- **PDF Guides**: Mental health resources, coping strategies
- **Embedded Viewers**: Watch videos and listen to audio directly in the app
- **Search & Filter**: Find resources by category (Videos, Audio, PDFs, Articles)
- **Auto-Embedded for AI Search**: Every resource is vectorized on upload so the RAG chat can find and recommend it

#### Weekly AI Wellness Reports
- **Auto-Generated Every Sunday**: A cron job (`node-cron`) builds a personalized PDF report for every student who logged a mood that week
- **Gemini-Written Narrative**: A natural-language summary of the week ("You were most stressed on Thursday...") grounded in the student's actual mood entries and notes
- **Visual Mood Chart**: Rendered server-side into the PDF using `pdf-lib`
- **On-Demand Generation**: Students can also generate a report immediately from the dashboard

#### Crisis Detection & Escalation
- **Automatic Flagging**: Triggers on high-risk chat keywords or a 5-day streak of high-intensity mood entries
- **Immediate Support**: Shows the student a crisis helpline the moment it's detected
- **Counselor Alerting**: Emails the counselor the student has previously seen (via Nodemailer), with a graceful fallback if SMTP isn't configured
- **Admin Visibility**: Flags the student with a live red alert on the admin dashboard

---

### 👨‍⚕️ For Counselors/Doctors

- **Appointment Management**: View, approve, or reject appointment requests
- **Student Privacy**: Access only necessary information (no personal mood data)
- **Filter System**: Organize appointments by status
- **Statistics Dashboard**: Track appointment volume and trends

---

### 👨‍💼 For Administrators

#### Analytics Dashboard
- **Overview Metrics**: Total users, active students, engagement rates
- **Mood Analytics**:
  - Pie chart showing mood distribution across campus
  - **Campus-wide mood trend line chart**, computed via MongoDB aggregation pipelines (`$group`/`$dateToString`), not client-side math
  - Week-over-week change in negative mood share
  - Top actions students are taking
  - AI-generated recommendations for campus-wide interventions
- **Chat Insights**: Most discussed topics, peak usage times
- **Forum Activity**: Engagement trends, most active discussions
- **Appointment Trends**: Booking patterns, counselor utilization
- **Peak Usage Analysis**: Heatmap of when students need support most
- **Crisis Alerts Panel**: Live-updating red alert list of students flagged by the escalation pipeline, with a "mark reviewed" action
- **Live Broadcast**: Send a campus-wide announcement that reaches every connected student instantly via Socket.IO

#### Resource Management
- **Upload Media**: Add videos, audio files, and PDFs (up to 100MB each)
- **Organize Content**: Categorize resources for easy discovery
- **Delete Resources**: Remove outdated content

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Real-Time**: Socket.IO Client
- **Notifications**: Sonner + shadcn/ui Toaster

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (aggregation pipelines for analytics)
- **Real-Time**: Socket.IO (JWT-authenticated WebSocket connections)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **AI Integration**: Google Gemini API (chat generation + `gemini-embedding-001` for RAG retrieval)
- **PDF Generation**: pdf-lib (weekly wellness reports)
- **Email**: Nodemailer (crisis escalation alerts)
- **Scheduled Jobs**: node-cron (weekly report generation)
- **CORS**: Enabled for cross-origin requests

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Environment Management**: dotenv
- **Code Quality**: ESLint, Prettier

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                          CampusCare System                            │
├───────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐   HTTP REST    ┌─────────────────┐               │
│  │   Frontend      │ ◄────────────► │    Backend      │               │
│  │   (React)       │                │   (Express)     │               │
│  │                 │  Socket.IO     │                 │               │
│  │  Port: 8080     │ ◄─────────────►│  Port: 5000     │               │
│  │                 │  (WebSocket)   │                 │               │
│  └─────────────────┘                └─────────────────┘               │
│         │                                    │                        │
│         ▼                                    ▼                        │
│  ┌─────────────────┐                ┌─────────────────┐               │
│  │  localStorage   │                │    MongoDB      │               │
│  │  (JWT tokens)   │                │   (Database)    │               │
│  └─────────────────┘                └─────────────────┘               │
│                                              │                        │
│                        ┌─────────────────────┼─────────────────────┐  │
│                        ▼                     ▼                     ▼  │
│               ┌─────────────────┐  ┌─────────────────┐  ┌───────────┐ │
│               │  Google Gemini  │  │   node-cron     │  │ Nodemailer│ │
│               │  Chat + Embed   │  │ Weekly reports  │  │  Crisis   │ │
│               │  (RAG retrieval)│  │   (pdf-lib)     │  │  alerts   │ │
│               └─────────────────┘  └─────────────────┘  └───────────┘ │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas cloud) - [Get Started](https://www.mongodb.com/)
- **Git** - [Download](https://git-scm.com/)
- **npm** (comes with Node.js)

### Clone Repository

```bash
git clone https://github.com/ambitiouswithayush/CampusCare.git
cd CampusCare
```

### Install Dependencies

#### Backend Setup

```bash
cd backend
npm install
```

#### Frontend Setup

```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Setup

### Backend Environment Variables

Create `backend/.env` file:

```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campuscare

# JWT Secret (generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini API Key (get from: https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=5000

# Environment
NODE_ENV=development

# --- Optional: Crisis Escalation Email (Nodemailer) ---
# If unset, crisis alerts still fire (admin dashboard + database) but the
# email step logs a warning instead of sending - safe to leave unset for dev.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
ALERT_FROM_EMAIL=your-email@gmail.com
COUNSELOR_ALERT_EMAIL=fallback-counselor@campuscare.edu
```

**How to Get API Keys:**

1. **MongoDB URI**:
   - Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster → Connect → Get connection string
   - Replace `<password>` with your database password

2. **Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API key
   - Copy and paste into `.env`

3. **JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

### Frontend Environment Variables

Create `frontend/.env` file:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000
```

---

## 💻 Usage

### Development Mode

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Server starts on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

App starts on `http://localhost:8082`

### Access the Application

1. Open browser: `http://localhost:8082`
2. Click **"Get Started"** → Register new account
3. Choose role:
   - **Student**: Access mood tracking, chat, appointments
   - **Doctor**: Manage appointments
   - **Admin**: View analytics dashboard

### Default Test Accounts

After running the setup, you can use these accounts:

**Admin:**
- Email: `admin@campuscare.edu`
- Password: `password`

**Doctor/Counselor:**
- Email: `doctor@campuscare.com`
- Password: `password`

**Student:**
- Email: `ayush.2327csit1152@kiet.edu`
- Password: `password`

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new user account |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/me` | Get current user info (protected) |

### Mood Tracking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/moods` | Log mood with optional note |
| GET | `/moods/history` | Get mood history |
| GET | `/moods/stats?days=7` | Get 7-day statistics |
| GET | `/moods/insights` | Get AI-generated insights |
| POST | `/moods/track-action` | Track clicked suggestion |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/send` | Send message, get AI response |
| GET | `/chat/history` | Get chat history |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/appointments` | Book appointment |
| GET | `/appointments/recommend?concern=anxiety` | Get rule-matched counselor recommendations |
| GET | `/appointments/student` | Get student's appointments |
| GET | `/appointments/doctor` | Get doctor's appointments |
| PATCH | `/appointments/:id/status` | Update status (approve/reject) |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get logged-in user's notification history |
| PUT | `/notifications/:id/read` | Mark one notification as read |
| PUT | `/notifications/read-all` | Mark all notifications as read |

### Wellness Report Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reports/generate` | Generate a wellness PDF report on demand |
| GET | `/reports` | List the student's past reports |

### Admin Endpoints (selected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/mood-trends?days=30` | Campus-wide daily mood trend (aggregation pipeline) |
| POST | `/admin/broadcast` | Push a live announcement to all connected users |
| GET | `/admin/crisis-alerts?status=open` | List students flagged by the crisis pipeline |
| PUT | `/admin/crisis-alerts/:id/resolve` | Mark a crisis alert as reviewed |

**For complete API documentation, see [BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md)**

---

## 📸 Screenshots

### Landing Page
Beautiful, welcoming landing page with clear call-to-action

### Student Dashboard
- Mood tracking with emoji selector
- Quick access cards to all features
- Mood trends visualization
- AI-generated insights

### AI Chat Interface
- Real-time AI responses
- Chat history
- Suggested conversation starters
- Privacy-focused design

### Mood Analytics (Admin)
- Pie chart showing campus-wide mood distribution
- Engagement metrics
- AI recommendations for interventions
- Privacy-protected (no PII)

### Resource Library
- Filter by category (Videos, Audio, PDFs)
- Embedded media viewers
- Search functionality
- Upload interface for admins

---

## 📖 Documentation

Comprehensive documentation is available:

- **[BACKEND_DOCUMENTATION.md](BACKEND_DOCUMENTATION.md)** - Complete backend guide with API reference
- **[FRONTEND_DOCUMENTATION.md](FRONTEND_DOCUMENTATION.md)** - Frontend architecture and component guide
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Step-by-step integration tutorial
- **[RESOURCE_UPLOAD_GUIDE.md](RESOURCE_UPLOAD_GUIDE.md)** - File upload feature documentation

---

## 🔒 Security & Privacy

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords encrypted with bcrypt
- **Anonymous Posting**: Forum posts can be made anonymously
- **Data Privacy**: Admin analytics show only aggregated, anonymized data
- **HTTPS Ready**: Production-ready with SSL/TLS support
- **Environment Variables**: Sensitive keys stored securely, never committed

---

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. Push to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy from `backend/` directory

### Frontend Deployment (Vercel/Netlify)

1. Connect GitHub repository
2. Set `VITE_API_BASE_URL` environment variable
3. Deploy from `frontend/` directory

**See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed deployment instructions.**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ayush Kumar**

- GitHub: [@ambitiouswithayush](https://github.com/ambitiouswithayush)
- Project Link: [https://github.com/ambitiouswithayush/CampusCare](https://github.com/ambitiouswithayush/CampusCare)

---

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for AI-powered chat
- [MongoDB](https://www.mongodb.com/) for database
- [React](https://react.dev/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- Mental health resources and inspiration from various campus wellness programs

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](#-documentation)
2. Search [existing issues](https://github.com/ambitiouswithayush/CampusCare/issues)
3. Open a [new issue](https://github.com/ambitiouswithayush/CampusCare/issues/new)

---

## ⭐ Star This Repository

If you find CampusCare helpful, please consider giving it a star! It helps others discover the project.

---

<div align="center">

**Built with ❤️ for student mental health**

---

*Developed by Ayush Kumar*

![Made with Love](https://img.shields.io/badge/Made%20with-Love-ff69b4?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

</div>
