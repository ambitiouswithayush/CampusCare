# 🔑 How to Access the Admin Dashboard

## Method 1: Using the Admin Dashboard Button (Easiest)

### Step 1: Login as Admin
1. Go to: http://localhost:8082/auth
2. Enter admin credentials:
   ```
   Email: admin@campuscare.edu
   Password: admin123
   ```
3. Click "Login"

### Step 2: Click the Admin Dashboard Button
After login, you'll be on the main dashboard. Look at the **top-right header**:

- You'll see a button with a **Shield icon** that says **"Admin Dashboard"**
- Click this button
- You'll be taken to the analytics dashboard

**Visual Guide:**
```
┌────────────────────────────────────────────────────────┐
│  CampusCare    Hi, Principal!  [🛡️ Admin Dashboard] [Logout] │
└────────────────────────────────────────────────────────┘
                                        ↑
                                  Click here!
```

---

## Method 2: Direct URL Access

Simply navigate to: **http://localhost:8082/admin**

**Note:** You must be logged in as an admin user first, otherwise you'll be redirected.

---

## Method 3: From Auth Page After Login

After logging in with admin credentials, the auth page will redirect you based on your role:
- **Student** → `/dashboard`
- **Doctor** → `/doctor`
- **Admin** → You can manually navigate to `/admin`

---

## 🔐 Admin User Credentials

### Default Admin Account

```
Email:    admin@campuscare.edu
Password: admin123
Role:     admin
```

### Creating Additional Admin Users

**Option 1: Via API**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin Name",
    "email": "newadmin@campuscare.edu",
    "password": "securepassword",
    "role": "admin"
  }'
```

**Option 2: Via Frontend Registration**
1. Go to: http://localhost:8082/auth
2. Click "Register"
3. Fill in the form
4. **Important:** Select "Admin" from the role dropdown
5. Click "Create Account"

---

## ✅ What You'll See in Admin Dashboard

Once you access the admin dashboard, you'll see:

### 1. Header Section
- 🛡️ Shield icon with "Principal's Office" title
- Your admin name displayed
- Logout button

### 2. Privacy Notice (Purple Banner)
- Explanation that all data is anonymous
- No personal information visible

### 3. Overview Statistics (3 Cards)
- Total Chat Sessions + 7-day trend
- Forum Posts + 7-day trend
- Appointments + 7-day trend

### 4. Top Mental Health Concerns
- Bar chart showing percentages
- Ranked list of top 3 concerns
- Examples: Anxiety (75.9%), Exam Stress (51.7%)

### 5. Peak Activity Hours
- Two line charts (Chat & Forum)
- Shows when students are most active
- Example: Peak at 12:00 PM

### 6. Forum Activity Stats
- Total posts, replies
- Average engagement
- Anonymous post percentage

### 7. Appointment Trends
- Pie chart of status distribution
- Top appointment reasons
- Percentage breakdown

### 8. Actionable Insights
- Purple gradient section
- Real-world recommendations
- Example: "Consider organizing anxiety workshops"

---

## 🚫 Troubleshooting Access Issues

### Issue 1: "Access Denied" Message
**Cause:** Your user role is not 'admin'

**Solution:**
- Make sure you're logged in with an admin account
- Check that the user has `role: "admin"` in the database
- Logout and login again with admin credentials

### Issue 2: Admin Dashboard Button Not Visible
**Cause:** You're logged in as a student or doctor

**Solution:**
- The button only appears for admin users
- Logout and login with: `admin@campuscare.edu` / `admin123`

### Issue 3: Redirected to Login Page
**Cause:** Not authenticated

**Solution:**
- Login first at http://localhost:8082/auth
- Then navigate to /admin

### Issue 4: "Loading analytics..." Never Ends
**Cause:** Backend not running or connection issue

**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000

# If not, start it:
cd backend
node server.js
```

### Issue 5: Charts Not Displaying
**Cause:** Recharts library issue

**Solution:**
```bash
cd frontend
npm install recharts
npm run dev
```

---

## 🎯 Role-Based Navigation

Different users see different dashboard buttons:

| User Role | Button in Header | Links To |
|-----------|-----------------|----------|
| **Student** | None | Stay on `/dashboard` |
| **Doctor** | 📅 Doctor Dashboard | `/doctor` |
| **Admin** | 🛡️ Admin Dashboard | `/admin` |

---

## 📱 Quick Access Shortcuts

### Bookmark These URLs

**For Daily Use:**
- Admin Dashboard: http://localhost:8082/admin
- Login Page: http://localhost:8082/auth

**For Development:**
- Backend API: http://localhost:5000/api/admin/overview
- Frontend Dev Server: http://localhost:8082

### Browser Shortcuts
1. **Chrome/Edge:** Press `Ctrl+D` (Windows) or `Cmd+D` (Mac) to bookmark
2. Name it: "CampusCare - Admin Dashboard"
3. One-click access anytime!

---

## 🔄 Switching Between Roles

Want to test different user types?

### Quick Role Switching
1. **Logout** from current account
2. **Login** with different credentials:

```
Student:
  Email: student@campuscare.edu
  Password: [student password]

Doctor:
  Email: doctor@campuscare.edu
  Password: [doctor password]

Admin:
  Email: admin@campuscare.edu
  Password: admin123
```

3. Notice different dashboard buttons appear based on role

---

## 🎨 Visual Guide: Header Navigation

### When Logged in as Admin:
```
┌──────────────────────────────────────────────────────────────┐
│ 🏥 CampusCare    Hi, Principal!  [🛡️ Admin Dashboard] [Logout] │
└──────────────────────────────────────────────────────────────┘
```

### When Logged in as Doctor:
```
┌──────────────────────────────────────────────────────────────┐
│ 🏥 CampusCare    Hi, Dr. Smith!  [📅 Doctor Dashboard] [Logout] │
└──────────────────────────────────────────────────────────────┘
```

### When Logged in as Student:
```
┌──────────────────────────────────────────────────────────────┐
│ 🏥 CampusCare    Hi, Ayush!  [Logout]                         │
└──────────────────────────────────────────────────────────────┘
```

---

## ✨ Pro Tips

1. **Keep Admin Tab Open**
   - Open admin dashboard in a separate browser tab
   - Pin the tab for quick access
   - Refresh to see updated analytics

2. **Use Incognito for Testing**
   - Test different roles without logging out
   - Regular window: Admin
   - Incognito window: Student

3. **Keyboard Shortcuts**
   - `Ctrl+L` → Highlight address bar
   - Type: `localhost:8082/admin`
   - Press Enter

4. **Mobile Access**
   - Dashboard is fully responsive
   - Access on phone: `http://[YOUR_IP]:8082/admin`
   - Example: `http://192.168.1.5:8082/admin`

---

## 🎉 Success!

You should now be able to access the Admin Dashboard easily using any of these methods!

**Preferred Method:** Login as admin → Click "Admin Dashboard" button in header → View analytics

**Need Help?** Check the troubleshooting section above or refer to [ADMIN_DASHBOARD_TESTING.md](ADMIN_DASHBOARD_TESTING.md)
