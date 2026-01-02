# 🧪 Quick Test Guide - Mood Tracking Features

## 🚀 Current Status

✅ **Backend:** Running on http://localhost:5000
✅ **Frontend:** Running on http://localhost:8082
✅ **MongoDB:** Connected
✅ **Authentication:** Working (admin & student logins successful)

---

## 📋 5-Minute Test Checklist

### Test 1: Student Mood Logging (2 minutes)

**Steps:**
1. Open http://localhost:8082
2. Login as student:
   - Email: `ayush.2327csit@kiet.edu`
   - Password: `password`

3. **Test Mood Journal:**
   - Scroll to "How are you feeling?" section
   - Click the 😰 (Anxious) emoji
   - ✅ **Verify:** MoodJournalDialog opens
   - ✅ **Verify:** Shows large 😰 emoji
   - ✅ **Verify:** Has textarea and writing prompts
   - Type: "Worried about upcoming exam"
   - Click "Save Mood & Note"
   - ✅ **Verify:** Toast notification appears
   - ✅ **Verify:** Dialog closes
   - ✅ **Verify:** Suggestions popup appears

4. **Test Suggestion Tracking:**
   - Click "Start Chat" in the suggestions
   - ✅ **Verify:** Navigates to /chat page
   - Click browser back button to return to Dashboard

5. **Test Mood Trends Widget:**
   - Scroll to "Mood Trends & Insights" section
   - ✅ **Verify:** MoodTrendsWidget shows:
     - Title: "Your Mood Trends (Last 7 days)"
     - Your mood entry appears
     - Bar chart with 😰 Anxious
     - Progress bar shows 100% (if only one mood)

6. **Log More Moods for Better Data:**
   - Click 😊 (Great) emoji → Add note "Good day today!" → Save
   - Click 😐 (Okay) emoji → Skip note → Save
   - Click 😔 (Down) emoji → Add note "Feeling tired" → Save
   - ✅ **Verify:** Widgets update each time

7. **Test Insights Widget:**
   - After logging 3+ moods, check MoodInsightsWidget
   - ✅ **Verify:** Shows personalized insights
   - ✅ **Verify:** Has color-coded icons
   - ✅ **Verify:** Shows suggestions with 💡

---

### Test 2: Admin Analytics (2 minutes)

**Steps:**
1. Logout (click Logout button in header)
2. Login as admin:
   - Email: `admin@campuscare.edu`
   - Password: `password`

3. ✅ **Verify:** Auto-redirects to `/admin` (not /dashboard)

4. **Test Admin Dashboard:**
   - Scroll down to "Student Mood Analytics" section
   - ✅ **Verify:** Section appears (if students have logged moods)
   - ✅ **Verify:** Pie chart shows mood distribution
   - ✅ **Verify:** Shows 4 stat cards:
     - Total Check-ins
     - Period (Last 30 days)
     - Engagement Rate
     - Most Stressful Day

5. **Test Privacy:**
   - Look through entire admin dashboard
   - ✅ **Verify:** NO student names visible
   - ✅ **Verify:** NO student emails visible
   - ✅ **Verify:** NO individual mood notes visible
   - ✅ **Verify:** ONLY aggregate data shown

6. **Test Top Actions:**
   - ✅ **Verify:** "What Students Did After Logging Mood" section shows actions
   - ✅ **Verify:** Shows "chat" if you clicked "Start Chat" earlier

7. **Test AI Recommendations:**
   - ✅ **Verify:** Purple/pink gradient box appears
   - ✅ **Verify:** Shows dynamic recommendations based on data
   - ✅ **Verify:** Recommendations change based on percentages

---

### Test 3: Edge Cases (1 minute)

**New Student Test:**
1. Logout
2. Login as another student:
   - Email: `anant.2327csit1200@kiet.edu`
   - Password: `password`
3. ✅ **Verify:** Mood widgets show empty state (no data yet)
4. Log first mood
5. ✅ **Verify:** Widgets appear with data

**Skip Note Test:**
1. Click any emoji
2. Don't type any note
3. Click "Skip & Save"
4. ✅ **Verify:** Mood saves without note
5. ✅ **Verify:** Suggestions still appear

---

## 🎯 Expected Results Summary

### Student Dashboard Should Show:
- ✅ Mood emoji buttons (4 options)
- ✅ MoodJournalDialog when clicking emoji
- ✅ Suggestions popup after saving mood
- ✅ MoodTrendsWidget with bar chart
- ✅ MoodInsightsWidget with AI insights
- ✅ Real-time updates when logging new moods

### Admin Dashboard Should Show:
- ✅ Pie chart with mood distribution
- ✅ Total check-ins count
- ✅ Engagement rate percentage
- ✅ Most stressful day of week
- ✅ Top actions students took
- ✅ AI recommendations
- ✅ NO personal student information

---

## 🐛 Troubleshooting

### If Mood Widgets Don't Appear:
1. Check browser console for errors (F12)
2. Verify backend is running (`npm run dev` in backend folder)
3. Check MongoDB connection
4. Log at least one mood first

### If Admin Analytics Empty:
1. Make sure students have logged moods
2. Refresh the page
3. Check backend console for API errors
4. Verify admin is logged in (role should be 'admin')

### If Journal Dialog Doesn't Open:
1. Check frontend console for errors
2. Verify MoodJournalDialog.tsx exists in components/mood/
3. Check that imports are correct in Dashboard.tsx
4. Refresh the page

### If Actions Not Tracking:
1. Check that latestMoodId is set
2. Verify moodAPI.trackAction is being called
3. Check backend logs for POST /api/moods/track-action
4. Verify you clicked a suggestion (not manual navigation)

---

## 📊 Test Data Verification

### Check MongoDB:
```bash
# Connect to MongoDB and verify data
# Collection: moods
# Expected fields:
{
  user: ObjectId,
  mood: "Anxious",
  emoji: "😰",
  note: "Worried about upcoming exam",
  triggeredActions: ["chat"],
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### API Endpoints to Test:

**Student Endpoints:**
- POST http://localhost:5000/api/moods (log mood)
- GET http://localhost:5000/api/moods/history (get history)
- GET http://localhost:5000/api/moods/stats?days=7 (get stats)
- GET http://localhost:5000/api/moods/insights (get insights)
- POST http://localhost:5000/api/moods/track-action (track action)

**Admin Endpoints:**
- GET http://localhost:5000/api/admin/mood-analytics?days=30

---

## ✨ Success Indicators

After testing, you should be able to:

1. **As Student:**
   - ✅ Log mood with optional note in 3 clicks
   - ✅ See personalized suggestions
   - ✅ View 7-day mood trends in chart
   - ✅ Receive AI-generated insights
   - ✅ Track mood patterns over time

2. **As Admin:**
   - ✅ See aggregated mood distribution
   - ✅ Identify most stressful day
   - ✅ View engagement metrics
   - ✅ See which features students use
   - ✅ Get AI recommendations for interventions

3. **Privacy:**
   - ✅ Students only see their own data
   - ✅ Admin only sees anonymous aggregates
   - ✅ No PII exposed in admin view

---

## 🎉 All Features Working?

If all tests pass, your mood tracking system is **fully operational**!

**Next Steps:**
- Test with multiple students for more realistic data
- Monitor admin analytics over time
- Gather user feedback on the journaling feature
- Consider adding date range filters for admin

**Need Help?**
- Check backend logs: `/tmp/claude/.../tasks/bcbc272.output`
- Check frontend logs: Browser console (F12)
- Review [MOOD_TRACKING_INTEGRATION_COMPLETE.md](MOOD_TRACKING_INTEGRATION_COMPLETE.md) for details

---

**Happy Testing! 🚀**
