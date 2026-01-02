# 🏢 Principal's Office - Admin Dashboard API Documentation

## Overview
The Admin Dashboard provides **completely anonymous, aggregated insights** into student mental health trends. This enables college authorities to make data-driven decisions without compromising student privacy.

### ✅ What Admins See
- Percentage of students mentioning specific concerns (exam stress, sleep issues, anxiety, etc.)
- Peak usage times for chat and forum
- Forum engagement statistics
- Appointment booking trends
- **All data is aggregated and anonymous**

### ❌ What Admins NEVER See
- Student names
- Student emails
- Individual chat messages
- Personal identifiable information

---

## 🔐 Authentication

All admin endpoints require:
1. **JWT Token** (Bearer token in Authorization header)
2. **Admin Role** (only users with `role: "admin"` can access)

### Create Admin User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Principal Admin",
  "email": "admin@campuscare.edu",
  "password": "admin123",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "user": {
    "_id": "694ecb079384728c873908d0",
    "name": "Principal Admin",
    "email": "admin@campuscare.edu",
    "role": "admin"
  }
}
```

---

## 📊 API Endpoints

### 1. Dashboard Overview
**Get all statistics at once**

```bash
GET /api/admin/overview
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "overview": {
    "totalEngagement": {
      "chats": 29,
      "forumPosts": 2,
      "appointments": 8
    },
    "recentActivity": {
      "chatsLast7Days": 29,
      "postsLast7Days": 2,
      "appointmentsLast7Days": 8
    },
    "topConcerns": [
      {
        "name": "Anxiety",
        "count": 22,
        "percentage": "75.9"
      },
      {
        "name": "Exam Stress",
        "count": 15,
        "percentage": "51.7"
      },
      {
        "name": "Sleep Issues",
        "count": 1,
        "percentage": "3.4"
      }
    ]
  }
}
```

**Use Case:** "This month, 75.9% of students who used the chatbot mentioned anxiety."

---

### 2. Chat Insights
**Mental health trends from AI chatbot conversations**

```bash
GET /api/admin/chat-insights
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "totalChats": 29,
    "concerns": {
      "examStress": {
        "count": 15,
        "percentage": "51.7"
      },
      "sleepIssues": {
        "count": 1,
        "percentage": "3.4"
      },
      "anxietyStress": {
        "count": 22,
        "percentage": "75.9"
      },
      "loneliness": {
        "count": 1,
        "percentage": "3.4"
      },
      "depression": {
        "count": 1,
        "percentage": "3.4"
      }
    }
  }
}
```

**Use Case:** "51.7% of students mentioned exam stress. The college can organize study skills workshops."

---

### 3. Peak Usage Time
**When students are most active (chat and forum)**

```bash
GET /api/admin/peak-usage
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "peakUsage": {
    "chat": {
      "hourlyDistribution": [
        {
          "hour": 12,
          "count": 14,
          "timeLabel": "12:00 - 12:59"
        },
        {
          "hour": 17,
          "count": 9,
          "timeLabel": "17:00 - 17:59"
        }
      ],
      "peakHour": {
        "hour": 12,
        "count": 14,
        "timeLabel": "12:00 - 12:59"
      }
    },
    "forum": {
      "hourlyDistribution": [
        {
          "hour": 13,
          "count": 1,
          "timeLabel": "13:00 - 13:59"
        }
      ],
      "peakHour": {
        "hour": 13,
        "count": 1,
        "timeLabel": "13:00 - 13:59"
      }
    }
  }
}
```

**Use Case:** "The peer-support forum is most active after 10 PM. The college can ensure counselors are available during evening hours."

---

### 4. Forum Activity
**Peer support engagement metrics**

```bash
GET /api/admin/forum-activity
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "forumActivity": {
    "totalPosts": 2,
    "totalReplies": 2,
    "avgRepliesPerPost": "1.0",
    "anonymousPostsPercentage": "100.0",
    "recentActivity": {
      "postsLast7Days": 2
    }
  }
}
```

**Use Case:** "100% of forum posts are anonymous, showing students feel safe sharing."

---

### 5. Appointment Trends
**Counseling demand and popular reasons**

```bash
GET /api/admin/appointment-trends
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "appointmentTrends": {
    "total": 8,
    "byStatus": {
      "pending": 8,
      "approved": 0,
      "rejected": 0
    },
    "statusPercentages": {
      "pendingPercent": "100.0",
      "approvedPercent": "0.0",
      "rejectedPercent": "0.0"
    },
    "recentActivity": {
      "appointmentsLast30Days": 8
    },
    "topReasons": [
      {
        "rank": 1,
        "reason": "Fever and headache",
        "count": 4,
        "percentage": "50.0"
      },
      {
        "rank": 2,
        "reason": "Feeling anxious about exams",
        "count": 1,
        "percentage": "12.5"
      }
    ]
  }
}
```

**Use Case:** "50% of appointments are for fever and headache. The college can run a health awareness campaign."

---

## 🔒 Security Features

### Admin-Only Access
```javascript
// middleware/adminMiddleware.js
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access only',
    });
  }
};
```

### Testing Security
**Non-admin users are blocked:**

```bash
# Student token attempting admin access
GET /api/admin/overview
Authorization: Bearer STUDENT_TOKEN

Response:
{
  "success": false,
  "message": "Admin access only"
}
```

---

## 🧪 Testing Guide

### 1. Register Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Principal Admin",
    "email": "admin@campuscare.edu",
    "password": "admin123",
    "role": "admin"
  }'
```

### 2. Test Dashboard Overview
```bash
curl -X GET http://localhost:5000/api/admin/overview \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Test Chat Insights
```bash
curl -X GET http://localhost:5000/api/admin/chat-insights \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Test with Non-Admin (Should Fail)
```bash
curl -X GET http://localhost:5000/api/admin/overview \
  -H "Authorization: Bearer STUDENT_TOKEN"

# Expected: {"success": false, "message": "Admin access only"}
```

---

## 📁 Implementation Files

| File | Purpose |
|------|---------|
| [backend/middleware/adminMiddleware.js](backend/middleware/adminMiddleware.js) | Admin-only access control |
| [backend/controllers/adminController.js](backend/controllers/adminController.js) | Analytics logic (5 endpoints) |
| [backend/routes/adminRoutes.js](backend/routes/adminRoutes.js) | Admin API routes |
| [backend/server.js](backend/server.js) | Routes registered at `/api/admin` |

---

## 🎯 Real-World Use Cases

### Scenario 1: Exam Stress Spike
**Data:** "40% of students mentioned exam stress this week."
**Action:** College organizes a "Study Skills & Stress Management" workshop.

### Scenario 2: Sleep Problems
**Data:** "18% of students are struggling with sleep issues."
**Action:** College launches a "Healthy Sleep Habits" campaign in hostels.

### Scenario 3: Peak Activity After 10 PM
**Data:** "Forum is most active between 10 PM - 12 AM."
**Action:** Ensure counselors are available during evening hours.

### Scenario 4: Low Appointment Approvals
**Data:** "100% of appointments are pending."
**Action:** Alert doctors to review and approve pending appointments.

---

## ✅ Privacy Compliance

### What This System Does:
- ✅ Only shows percentages and counts
- ✅ Never reveals individual identities
- ✅ Aggregates data across all students
- ✅ Helps college make proactive decisions

### What This System NEVER Does:
- ❌ Show student names or emails
- ❌ Display individual chat messages
- ❌ Link concerns to specific students
- ❌ Compromise student privacy

---

## 🚀 Next Steps (Frontend)

To build the Admin Dashboard UI:

1. Create `AdminDashboard.tsx` page
2. Add route protection for admin role
3. Use Recharts (already installed) for visualizations:
   - Bar chart for top concerns
   - Line chart for peak usage hours
   - Pie chart for appointment status
   - Card components for quick stats
4. Call these API endpoints to populate the UI

**The backend is complete and ready to use!** 🎉
