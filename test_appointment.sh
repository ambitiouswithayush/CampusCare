#!/bin/bash

# First, login as student and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ayush.2327csit1152@kiet.edu","password":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Student Token: $TOKEN"

# Create appointment for Dr. Smith
echo ""
echo "Creating appointment for Dr. Smith..."
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"doctorId":"694d11422f2ca707c078354b","date":"2025-12-30","time":"10:00 AM","reason":"Test appointment"}'

echo ""
echo ""
echo "Fetching Dr. Smith's appointments..."
# Login as Dr. Smith
DR_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@campuscare.com","password":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl http://localhost:5000/api/appointments/doctor \
  -H "Authorization: Bearer $DR_TOKEN"

