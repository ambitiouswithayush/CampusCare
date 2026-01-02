# 🧪 Admin Dashboard Testing Guide

## Quick Start

### 1. Access the Admin Dashboard

**URL:** http://localhost:8082/admin

### 2. Admin Login Credentials

Use these credentials to test the admin dashboard:

```
Email: admin@campuscare.edu
Password: admin123
Role: admin
```

---

## 🎯 What to Test

### Frontend UI Components

#### ✅ Header Section
- [ ] Shield icon and "Principal's Office" title displayed
- [ ] "Anonymous Analytics Dashboard" subtitle shown
- [ ] Admin name displayed (Principal Admin)
- [ ] Logout button works

#### ✅ Privacy Notice
- [ ] Purple banner with privacy message visible
- [ ] Clear explanation that all data is anonymous

#### ✅ Overview Statistics (3 Cards)
- [ ] **Total Chat Sessions** - Shows count + 7-day trend
- [ ] **Forum Posts** - Shows count + 7-day trend
- [ ] **Appointments** - Shows count + 7-day trend

#### ✅ Top Mental Health Concerns Section
- [ ] Bar chart showing percentages for 5 concerns
- [ ] List of top 3 concerns with rankings
- [ ] Percentages and mention counts displayed

#### ✅ Peak Activity Hours Section
- [ ] Two line charts (Chat & Forum)
- [ ] Peak hour information displayed
- [ ] X-axis shows hours (0-23)
- [ ] Y-axis shows activity count

#### ✅ Forum Activity Card
- [ ] Total Posts count
- [ ] Total Replies count
- [ ] Average Replies per Post
- [ ] Anonymous Posts percentage

#### ✅ Appointment Status Card
- [ ] Pie chart showing status distribution
- [ ] Top 3 appointment reasons listed
- [ ] Percentages for each reason

#### ✅ Actionable Insights Section
- [ ] Gradient purple/pink background
- [ ] Top concern insight displayed
- [ ] Peak activity time insight displayed
- [ ] Recommendations shown

---

## 🔒 Security Testing

### Test 1: Admin Access Only

**Expected:** Only users with `role: "admin"` can access `/admin`

1. **Login as Student**
   ```
   Email: student@campuscare.edu (or any student account)
   Password: [their password]
   ```

2. **Try to access:** http://localhost:8082/admin

3. **Expected Result:**
   - Toast notification: "Access Denied - Only administrators can access this page"
   - Automatically redirected to `/dashboard`

### Test 2: Unauthenticated Access

**Expected:** Redirect to login

1. **Logout** if logged in
2. **Try to access:** http://localhost:8082/admin
3. **Expected Result:**
   - Redirected to `/auth` (login page)

---

## 📊 Data Validation

### Backend API Endpoints

Test that all 5 endpoints return data:

#### 1. Dashboard Overview
```bash
curl -X GET "http://localhost:5000/api/admin/overview" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Fields:**
- `totalEngagement` (chats, forumPosts, appointments)
- `recentActivity` (last 7 days for each)
- `topConcerns` (array of top 3 concerns)

#### 2. Chat Insights
```bash
curl -X GET "http://localhost:5000/api/admin/chat-insights" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Fields:**
- `totalChats`
- `concerns` (examStress, sleepIssues, anxietyStress, loneliness, depression)
- Each concern has `count` and `percentage`

#### 3. Peak Usage
```bash
curl -X GET "http://localhost:5000/api/admin/peak-usage" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Fields:**
- `chat.hourlyDistribution` (array of hours with counts)
- `chat.peakHour` (hour with most activity)
- Same for `forum`

#### 4. Forum Activity
```bash
curl -X GET "http://localhost:5000/api/admin/forum-activity" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Fields:**
- `totalPosts`, `totalReplies`, `avgRepliesPerPost`
- `anonymousPostsPercentage`
- `recentActivity.postsLast7Days`

#### 5. Appointment Trends
```bash
curl -X GET "http://localhost:5000/api/admin/appointment-trends" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Fields:**
- `total`, `byStatus` (pending, approved, rejected)
- `statusPercentages`
- `topReasons` (top 5 appointment reasons)

---

## 🎨 Visual Testing Checklist

### Charts & Visualizations

- [ ] **Bar Chart (Concerns)** - Purple bars, proper labels
- [ ] **Line Charts (Peak Usage)** - Smooth lines, grid visible
- [ ] **Pie Chart (Appointments)** - Colors visible, labels clear
- [ ] **Responsive Design** - Works on mobile, tablet, desktop

### Color Scheme

- [ ] Purple gradient backgrounds
- [ ] Consistent color palette (purple, pink, blue)
- [ ] Good contrast for readability
- [ ] Icons match their respective colors

### Animations

- [ ] Smooth fade-in on page load
- [ ] Cards animate in sequence (stagger effect)
- [ ] Hover effects on interactive elements

---

## ✅ Privacy Compliance Check

### What Should NEVER Be Visible

- [ ] ❌ Student names
- [ ] ❌ Student emails
- [ ] ❌ Individual chat message content
- [ ] ❌ Personal identifiable information

### What Should Be Visible

- [ ] ✅ Aggregate percentages only
- [ ] ✅ Total counts (not linked to individuals)
- [ ] ✅ Time-based trends (hourly, daily)
- [ ] ✅ Anonymous statistics

---

## 🚀 Real-World Scenario Testing

### Scenario 1: New Administrator

1. Create a new admin user
2. Login and access `/admin`
3. Verify all data loads correctly
4. Check that privacy notice is prominent

### Scenario 2: No Data Available

1. Test with a fresh database (no chats, posts, appointments)
2. Verify dashboard shows "0" gracefully
3. No errors or crashes

### Scenario 3: Peak Hour Insights

1. Check the Peak Activity Hours section
2. Verify the peak hour is highlighted
3. Confirm time labels are human-readable (e.g., "12:00 - 12:59")

### Scenario 4: Top Concerns

1. Look at the Top Mental Health Concerns
2. Verify percentages add up logically
3. Check that actionable insights reference the top concern

---

## 🐛 Known Issues & Fixes

### Issue 1: "Loading analytics..." Never Ends

**Cause:** Backend not running or token expired

**Fix:**
```bash
# Restart backend
cd backend && node server.js

# Re-login to get a fresh token
```

### Issue 2: Charts Not Displaying

**Cause:** Recharts library not installed

**Fix:**
```bash
cd frontend
npm install recharts
```

### Issue 3: 403 Forbidden Error

**Cause:** User is not an admin

**Fix:**
- Ensure you're logged in as a user with `role: "admin"`
- Check the admin middleware is working correctly

---

## 📸 Screenshot Checklist

For documentation, capture:

1. **Full Dashboard** - All sections visible
2. **Top Concerns Chart** - Bar chart close-up
3. **Peak Usage** - Line charts showing activity
4. **Actionable Insights** - Purple gradient section
5. **Privacy Notice** - Prominent banner
6. **Mobile View** - Responsive layout

---

## ✨ Success Criteria

The Admin Dashboard is working correctly if:

1. ✅ Only admin users can access it
2. ✅ All 5 API endpoints return data
3. ✅ All charts render without errors
4. ✅ No personal data is visible
5. ✅ Privacy notice is displayed
6. ✅ Actionable insights are shown
7. ✅ Responsive on all devices
8. ✅ Logout works correctly

---

## 🎉 Next Steps After Testing

1. **Add More Analytics** (optional):
   - Monthly trends over time
   - Comparison between current and previous month
   - Resource usage statistics

2. **Export Reports** (optional):
   - Download data as PDF
   - Export charts as images
   - CSV export for further analysis

3. **Email Notifications** (optional):
   - Weekly summary to principal
   - Alerts for concerning trends

---

## 📞 Support

If you encounter issues:

1. Check backend logs: `backend/server.js` console
2. Check frontend console: Browser DevTools (F12)
3. Verify all environment variables are set
4. Ensure MongoDB is connected

**Admin Dashboard is ready for production use!** 🚀
