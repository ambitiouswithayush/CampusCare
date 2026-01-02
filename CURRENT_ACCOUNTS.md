# 🔐 CampusCare - Current User Accounts

**Last Updated:** January 3, 2026
**Total Users:** 14
**All passwords:** `password`

---

## 👨‍💼 Admin Account (1)

| Name | Email | Password | Role |
|------|-------|----------|------|
| Principal Admin | admin@campuscare.edu | password | admin |

---

## 👨‍⚕️ Counselor/Doctor Accounts (2)

| Name | Email | Password | Role |
|------|-------|----------|------|
| Anant | anant.2327csit1200@kiet.edu | password | doctor |
| Dr. Smith | doctor@campuscare.com | password | doctor |

---

## 👨‍🎓 Student Accounts (11)

| Name | Email | Password | Role |
|------|-------|----------|------|
| Ayush Kumar | ayush.2327csit1152@kiet.edu | password | student |
| Ayush Kumar | ayush.2327csit@kiet.edu | password | student |
| Ayush Kumar | ayush@test.com | password | student |
| Test Student | test@student.com | password | student |
| Test User | test@example.com | password | student |
| Test User | test2@example.com | password | student |
| Rahul Sharma | rahul.2327csit1201@kiet.edu | password | student |
| Priya Singh | priya.2327csit1202@kiet.edu | password | student |
| Amit Patel | amit.2327csit1203@kiet.edu | password | student |
| Sneha Gupta | sneha.2327csit1204@kiet.edu | password | student |
| Vikas Kumar | vikas.2327csit1205@kiet.edu | password | student |

---

## 🚀 How to Login

1. Go to: **http://localhost:8083/auth**
2. Enter email and password from above
3. Click "Login"
4. You'll be redirected based on role:
   - **Admin** → `/admin` (Analytics Dashboard)
   - **Doctor** → `/doctor` (Appointment Management)
   - **Student** → `/dashboard` (Student Dashboard)

---

## 🔧 Add More Students

Run this command:
```bash
cd backend
node addStudent.js "Student Name" "email@kiet.edu" "password" "StudentID"
```

Or for bulk add:
```bash
node addBulkStudents.js
```

---

## 🔄 Reset All Passwords

If you ever need to reset all passwords to "password":
```bash
cd backend
node resetAllPasswords.js
```

---

**✅ All accounts verified and working!**
