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

#### AI-Powered Chat
- **24/7 Support**: Instant responses powered by Google Gemini AI
- **Context-Aware**: AI understands mental health context and provides appropriate guidance
- **Chat History**: Review past conversations for continuity
- **Suggested Prompts**: Quick-start conversation starters

#### Appointment Booking
- **Easy Scheduling**: Book sessions with campus counselors
- **Date & Time Selection**: Choose from available slots
- **Reason Input**: Provide context for your appointment
- **Status Tracking**: Monitor appointment status (Pending/Approved/Rejected)

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
  - Engagement metrics (check-in rate, most stressful days)
  - Top actions students are taking
  - AI-generated recommendations for campus-wide interventions
- **Chat Insights**: Most discussed topics, peak usage times
- **Forum Activity**: Engagement trends, most active discussions
- **Appointment Trends**: Booking patterns, counselor utilization
- **Peak Usage Analysis**: Heatmap of when students need support most

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
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **AI Integration**: Google Gemini API
- **CORS**: Enabled for cross-origin requests

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Environment Management**: dotenv
- **Code Quality**: ESLint, Prettier

---

## 🏗️ Architecture

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
│         │                            │                       │
│         ▼                            ▼                       │
│  ┌─────────────────┐         ┌─────────────────┐            │
│  │  localStorage   │         │    MongoDB      │            │
│  │  (JWT tokens)   │         │   (Database)    │            │
│  └─────────────────┘         └─────────────────┘            │
│                                      │                       │
│                              ┌───────▼─────────┐             │
│                              │  Google Gemini  │             │
│                              │   (AI Chat)     │             │
│                              └─────────────────┘             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
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
| GET | `/appointments/student` | Get student's appointments |
| GET | `/appointments/doctor` | Get doctor's appointments |
| PATCH | `/appointments/:id/status` | Update status (approve/reject) |

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
