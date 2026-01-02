# 😊 Mood Tracking & Smart Suggestions Feature

## ✅ What Was Added

The mood check-in now includes **personalized suggestions** that appear when you click on an emoji!

---

## 🎯 How It Works

### Before (Old)
- 4 emoji buttons
- Clicking did nothing (TODO comment)
- No feedback or suggestions

### After (New) ✨
- 4 emoji buttons with labels
- Click emoji → **Mood logged** (saved to localStorage)
- **Personalized suggestions popup** appears
- Suggestions are **context-aware** based on your mood
- Click suggestions to navigate to helpful resources

---

## 😊 Mood Options & Suggestions

### 1. 😊 Great (Feeling Good)

**Suggestions:**
- ✨ Keep this positive momentum going! → Share your tips in Common Room
- 📚 Explore wellness resources to stay balanced → Browse Resources
- ❤️ Help others who might be struggling → Visit Common Room

**Color:** Green background

---

### 2. 😐 Okay (Feeling Neutral)

**Suggestions:**
- 💬 Chat with our AI companion for a mood boost → Start Chat
- 📚 Discover tips for improving your day → View Resources
- 👥 Connect with peers in the Common Room → Join Community

**Color:** Blue background

---

### 3. 😔 Down (Feeling Sad)

**Suggestions:**
- 💬 Talk to our AI - it's here to listen → Chat Now
- 📅 Consider booking a counselor session → Book Appointment
- 👥 You're not alone - connect with others → Common Room
- ☎️ Need immediate help? Call crisis helpline → 1800-599-0019

**Color:** Purple background

---

### 4. 😰 Anxious (Feeling Stressed)

**Suggestions:**
- 💬 Chat with AI about what's bothering you → Start Chat
- 📅 Book an appointment with a counselor → Book Now
- 📚 Try guided breathing or relaxation exercises → View Resources
- ☎️ Crisis helpline available 24/7 → Call 1800-599-0019

**Color:** Orange background

---

## 🎨 Visual Features

### Interactive Elements

1. **Hover Effect**
   - Emojis scale up on hover (1.1x)
   - Smooth transition animation

2. **Selected State**
   - Selected emoji gets colored background
   - Border highlight (2px)
   - Stays scaled up

3. **Suggestions Popup**
   - Smooth slide-down animation
   - Colored background matching mood
   - Close button (X) in top-right
   - Click outside or close button to dismiss

4. **Suggestion Cards**
   - Staggered fade-in animation
   - Icon with white background
   - Hover effect (background lightens)
   - Clickable - navigates to resource

---

## 💾 Data Tracking

### What Gets Saved

Each mood check-in is saved to **localStorage**:

```javascript
{
  mood: "Great",        // Label: Great, Okay, Down, Anxious
  emoji: "😊",          // The emoji
  timestamp: "2025-12-27T..." // ISO timestamp
}
```

### Storage Key
`mood_logs` in localStorage

### View Your Mood History

Open browser console and run:
```javascript
JSON.parse(localStorage.getItem('mood_logs'))
```

You'll see all your mood check-ins with timestamps.

---

## 🔄 User Journey

### Example: Student Feeling Anxious

1. **Opens Dashboard**
   - Sees "How are you feeling?" section
   - 4 emoji options visible

2. **Clicks 😰 (Anxious)**
   - Toast notification: "Mood logged: Anxious"
   - Emoji gets orange background
   - Suggestions popup slides down

3. **Sees Personalized Suggestions**
   ```
   😰 Feeling Anxious
   Here are some suggestions for you

   💬 Chat with AI about what's bothering you
      → Start Chat

   📅 Book an appointment with a counselor
      → Book Now

   📚 Try guided breathing or relaxation exercises
      → View Resources

   ☎️ Crisis helpline available 24/7
      → Call 1800-599-0019
   ```

4. **Clicks "Start Chat"**
   - Navigates to `/chat`
   - Can immediately talk to AI
   - Suggestions popup closes

---

## 🎯 Why This Feature Is Important

### 1. **Contextual Help**
- Suggestions match the user's emotional state
- More likely to take action when it's relevant

### 2. **Gentle Guidance**
- Not pushy or overwhelming
- User chooses what feels right
- Multiple options for different preferences

### 3. **Crisis Support**
- Anxious and Down moods include crisis helpline
- Immediate access to professional help
- No barriers to getting support

### 4. **Positive Reinforcement**
- Feeling great? Share with community!
- Encourages helping others
- Builds positive habits

### 5. **Data Collection (Future)**
- Mood logs can be used for:
  - Personal mood trends over time
  - Analytics for admin dashboard
  - Understanding student wellness patterns

---

## 🔮 Future Enhancements

### Phase 2: Mood Trends
```javascript
// Show user their mood history
"You've logged 5 moods this week:
  😊 Great: 2 times
  😐 Okay: 2 times
  😔 Down: 1 time"
```

### Phase 3: Smart Insights
```javascript
// Detect patterns
"You often feel anxious on Monday mornings.
 Consider trying morning meditation."
```

### Phase 4: Admin Analytics
- Anonymous mood trends
- "40% of students feeling anxious this week"
- Integrate with Admin Dashboard

### Phase 5: Mood Journaling
- Optional text note with mood
- "What made you feel this way?"
- Private, encrypted storage

---

## 🧪 Testing Guide

### Test 1: Happy Path

1. **Open Dashboard**
2. **Click 😊 (Great)**
3. **Expected:**
   - Toast: "Mood logged: Great"
   - Green suggestions box appears
   - 3 suggestions visible
4. **Click "Share your tips in Common Room"**
5. **Expected:**
   - Navigate to `/community`
   - Suggestions close

### Test 2: Different Moods

1. **Click each emoji (😊, 😐, 😔, 😰)**
2. **Expected:**
   - Each has different colored background
   - Different suggestions appear
   - Relevant resources suggested

### Test 3: Close Suggestions

1. **Click any emoji**
2. **Click X button** in suggestions
3. **Expected:**
   - Suggestions slide up and disappear
   - Can click emoji again

### Test 4: Mood Persistence

1. **Click 😰 (Anxious)**
2. **Refresh page**
3. **Expected:**
   - Emoji is still selected (orange background)
   - Can click again to see suggestions

### Test 5: Data Storage

1. **Click different emojis 3-4 times**
2. **Open Console:** `localStorage.getItem('mood_logs')`
3. **Expected:**
   - JSON array with all mood entries
   - Each has mood, emoji, timestamp

---

## 📁 Files Modified

### [Dashboard.tsx](frontend/src/pages/Dashboard.tsx)

**Added:**
- Import `AnimatePresence`, `Sparkles`, `X` icons
- Import `useState`, `toast`
- `moodOptions` array with 4 moods and suggestions
- `selectedMood` state
- `showSuggestions` state
- `handleMoodSelect()` function
- `handleCloseSuggestions()` function
- `handleSuggestionClick()` function
- Suggestions popup UI with animations

**Changed:**
- Mood emoji buttons now call `handleMoodSelect()`
- Added conditional styling for selected mood
- Added AnimatePresence for smooth animations

---

## 🎨 Design Decisions

### Why These 4 Moods?

- **😊 Great** - Captures positive state
- **😐 Okay** - Neutral/average day
- **😔 Down** - Sad/low energy
- **😰 Anxious** - Stress/worry

**Alternative considered:**
- 5 moods (add 😴 Tired)
- Decided: 4 is simpler, less overwhelming

### Why Popup vs New Page?

**Popup (Chosen):**
- ✅ Immediate feedback
- ✅ Stays in context
- ✅ Quick to dismiss

**New Page:**
- ❌ Feels disruptive
- ❌ Extra navigation step

### Why localStorage vs Backend?

**localStorage (Current):**
- ✅ Instant, no API calls
- ✅ Works offline
- ✅ Simple to implement

**Backend (Future):**
- Can sync across devices
- Admin can see trends
- More secure

---

## ♿ Accessibility

### Keyboard Support
- Emoji buttons are `<button>` elements
- Tab to focus, Enter to select
- Suggestions are keyboard navigable

### Screen Readers
- `title` attribute on emojis
- Clear text labels
- Semantic HTML structure

### Visual
- High contrast colors
- Large touch targets (56x56px)
- Clear hover states

---

## 📊 Analytics Potential

### Questions Admin Can Answer (Future)

1. **When are students most stressed?**
   - "Anxious moods peak on Monday mornings"

2. **Are interventions working?**
   - "After meditation workshop, 'Down' moods decreased 30%"

3. **Which resources are most helpful?**
   - "Students who chat with AI report better moods"

4. **Seasonal patterns?**
   - "Stress increases during exam season"

---

## 🚀 How to Use (User Guide)

### For Students

1. **Daily Check-in**
   - Open your dashboard
   - Click the emoji that matches your mood
   - See personalized suggestions

2. **Take Action**
   - Click any suggestion that resonates
   - Access the recommended resource
   - No pressure - it's optional!

3. **Track Over Time**
   - Your moods are saved
   - Future feature: See your trends
   - Understand your patterns

### For Developers

1. **Access Mood Data**
   ```javascript
   const logs = JSON.parse(localStorage.getItem('mood_logs') || '[]');
   ```

2. **Add New Suggestions**
   ```javascript
   // In moodOptions array
   suggestions: [
     { icon: NewIcon, text: 'Description', action: 'Button text', link: '/path' }
   ]
   ```

3. **Send to Backend (Future)**
   ```javascript
   // In handleMoodSelect()
   await api.post('/mood', moodLog);
   ```

---

## ✨ Summary

The mood tracking feature transforms a static emoji row into an **interactive wellness tool** that:

- ✅ Logs student moods for future insights
- ✅ Provides **context-aware suggestions**
- ✅ Guides students to the right resources
- ✅ Creates a caring, supportive experience
- ✅ Builds foundation for future analytics

**Try it now:** Login as a student and click an emoji! 🎉
