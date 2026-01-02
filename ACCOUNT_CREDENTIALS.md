# 🔐 CampusCare Account Credentials

## All passwords have been reset to: `password`

---

## 👨‍💼 Admin Account

**Login at:** http://localhost:8082/auth

| Field | Value |
|-------|-------|
| **Email** | `admin@campuscare.edu` |
| **Password** | `password` |
| **Role** | Admin |
| **Access** | - View anonymous analytics<br>- Mood analytics dashboard<br>- Chat insights<br>- Forum activity<br>- Appointment trends<br>- Peak usage times |

**What you'll see:**
- Auto-redirects to `/admin` dashboard
- All analytics sections including new mood tracking
- NO student personal information
- Only aggregated, anonymous data

---

## 👨‍⚕️ Doctor/Counselor Accounts

### Doctor 1: Dr. Smith
| Field | Value |
|-------|-------|
| **Email** | `doctor@campuscare.com` |
| **Password** | `password` |
| **Role** | Doctor |
| **Access** | - View appointments<br>- Manage student appointments<br>- Doctor dashboard |

### Doctor 2: Anant
| Field | Value |
|-------|-------|
| **Email** | `anant.2327csit1200@kiet.edu` |
| **Password** | `password` |
| **Role** | Doctor |
| **Access** | - View appointments<br>- Manage student appointments<br>- Doctor dashboard |

**What you'll see:**
- Doctor dashboard with appointment management
- Student appointment requests
- Ability to approve/reject appointments

---

## 🎓 Student Accounts

### Student 1: Ayush Kumar
| Field | Value |
|-------|-------|
| **Email** | `ayush.2327csit@kiet.edu` |
| **Password** | `password` |
| **Role** | Student |
| **Access** | - Student dashboard<br>- Mood tracking<br>- AI chat<br>- Community forum<br>- Book appointments<br>- Resources |

### Student 2: Ayush Kumar (1152)
| Field | Value |
|-------|-------|
| **Email** | `ayush.2327csit1152@kiet.edu` |
| **Password** | `password` |
| **Role** | Student |
| **Access** | - Student dashboard<br>- Mood tracking<br>- AI chat<br>- Community forum<br>- Book appointments<br>- Resources |

**What you'll see:**
- Student dashboard with mood tracking
- Mood journal dialog when clicking emojis
- Mood trends widget (7-day chart)
- Mood insights widget (AI-generated)
- Personalized suggestions based on mood
- All student features (chat, appointments, community, resources)

---

## 🧪 Quick Test Guide

### Test Admin Login:
```bash
1. Go to http://localhost:8082/auth
2. Email: admin@campuscare.edu
3. Password: password
4. Click "Sign In"
5. ✅ Should auto-redirect to /admin
6. Scroll down to see "Student Mood Analytics"
```

### Test Doctor Login:
```bash
1. Go to http://localhost:8082/auth
2. Email: doctor@campuscare.com
3. Password: password
4. Click "Sign In"
5. ✅ Should redirect to /doctor dashboard
```

### Test Student Login:
```bash
1. Go to http://localhost:8082/auth
2. Email: ayush.2327csit@kiet.edu
3. Password: password
4. Click "Sign In"
5. ✅ Should redirect to /dashboard
6. Click any mood emoji to test mood tracking
```

---

## ⚠️ Troubleshooting

### If Login Still Fails:

1. **Clear Browser Cache:**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Clear cookies and cached data
   - Try logging in again

2. **Check Backend Logs:**
   - Look at terminal running backend
   - Should show "Password match: true" when login succeeds
   - If shows "Password match: false", passwords might not be synced

3. **Verify Backend is Running:**
   ```bash
   # Should show "Server running on port 5000"
   # And "MongoDB Connected"
   ```

4. **Verify Frontend is Running:**
   ```bash
   # Should show "Local: http://localhost:8082/"
   ```

5. **Check Database Connection:**
   - Ensure MongoDB is connected
   - Check .env file has correct MONGO_URI

---

## 🔄 Reset All Passwords Again

If you need to reset passwords again, run:

```bash
cd backend
node resetPasswords.js
```

This will reset all accounts to password: `password`

---

## ✅ Current Working Credentials Summary

**All accounts now use the same password: `password`**

| Email | Password | Role |
|-------|----------|------|
| `admin@campuscare.edu` | `password` | Admin |
| `doctor@campuscare.com` | `password` | Doctor |
| `anant.2327csit1200@kiet.edu` | `password` | Doctor |
| `ayush.2327csit@kiet.edu` | `password` | Student |
| `ayush.2327csit1152@kiet.edu` | `password` | Student |

---

## 🎯 Next Steps

1. ✅ **Test Admin Login** - Verify admin dashboard and mood analytics
2. ✅ **Test Doctor Login** - Verify doctor dashboard and appointments
3. ✅ **Test Student Login** - Verify mood tracking features
4. ✅ **Log Multiple Moods** - Create data for admin analytics
5. ✅ **Check Admin Analytics** - See mood distribution and insights

**All systems ready! Start testing! 🚀**
