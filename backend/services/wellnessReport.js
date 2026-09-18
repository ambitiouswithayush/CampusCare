const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Mood = require('../models/Mood');
const WellnessReport = require('../models/WellnessReport');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MOOD_SCORE = { Great: 4, Okay: 3, Down: 2, Anxious: 1 };
const MOOD_COLOR = {
  Great: rgb(0.06, 0.72, 0.5),
  Okay: rgb(0.23, 0.51, 0.96),
  Down: rgb(0.66, 0.33, 0.97),
  Anxious: rgb(0.96, 0.62, 0.04),
};

const wrapText = (text, font, fontSize, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
};

// Builds the Gemini narrative: "Your week in review..." grounded in the
// student's actual mood entries and notes, not a generic template.
const generateNarrative = async (studentName, moods) => {
  if (moods.length === 0) {
    return `Hi ${studentName}, you didn't log any moods this week. Checking in regularly helps us understand how you're doing - try logging your mood even on ordinary days.`;
  }

  const dayLines = moods
    .map((m) => {
      const day = new Date(m.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
      return `- ${day}: ${m.mood}${m.note ? ` (note: "${m.note}")` : ''}`;
    })
    .join('\n');

  const prompt = `
You are writing a short, warm, personalized "weekly wellness report" for a college student named ${studentName}, based on their mood check-ins this week.

Their entries this week:
${dayLines}

Write a 100-150 word narrative in second person ("You were..."). Identify their most stressful day and their calmest day if the data shows one. If any notes mention physical activity (walking, gym, exercise, sports) on calmer days, point out that correlation. Be encouraging, specific, and never clinical or alarmist. Do not use markdown formatting.
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Wellness narrative generation failed:', error.message);
    const mostCommon = moods
      .reduce((acc, m) => {
        acc[m.mood] = (acc[m.mood] || 0) + 1;
        return acc;
      }, {});
    const topMood = Object.entries(mostCommon).sort((a, b) => b[1] - a[1])[0][0];
    return `Hi ${studentName}, this week you logged your mood ${moods.length} time(s), most often feeling "${topMood}". Keep checking in - small, consistent reflection adds up.`;
  }
};

const buildPdf = async ({ studentName, weekStart, weekEnd, narrative, moods }) => {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 780;
  const margin = 50;

  page.drawText('CampusCare Weekly Wellness Report', { x: margin, y, size: 20, font: boldFont, color: rgb(0.29, 0.34, 0.9) });
  y -= 30;
  page.drawText(`${studentName} — ${weekStart.toDateString()} to ${weekEnd.toDateString()}`, {
    x: margin, y, size: 11, font, color: rgb(0.4, 0.4, 0.4),
  });
  y -= 40;

  page.drawText('Your week in review', { x: margin, y, size: 14, font: boldFont });
  y -= 20;

  const narrativeLines = wrapText(narrative.trim(), font, 11, 495);
  narrativeLines.forEach((line) => {
    page.drawText(line, { x: margin, y, size: 11, font, color: rgb(0.15, 0.15, 0.15) });
    y -= 16;
  });

  y -= 20;
  page.drawText('Daily mood snapshot', { x: margin, y, size: 14, font: boldFont });
  y -= 25;

  // Simple bar visualization: one bar per logged day, height ~ mood score
  const barWidth = 40;
  const gap = 15;
  const baseY = y - 100;
  moods.forEach((m, i) => {
    const score = MOOD_SCORE[m.mood] || 2;
    const barHeight = score * 22;
    const x = margin + i * (barWidth + gap);
    page.drawRectangle({
      x, y: baseY, width: barWidth, height: barHeight,
      color: MOOD_COLOR[m.mood] || rgb(0.6, 0.6, 0.6),
    });
    const day = new Date(m.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
    page.drawText(day, { x, y: baseY - 15, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(m.mood, { x, y: baseY + barHeight + 4, size: 8, font, color: rgb(0.3, 0.3, 0.3) });
  });

  page.drawText('Generated automatically by CampusCare. Not a clinical diagnosis.', {
    x: margin, y: 40, size: 8, font, color: rgb(0.6, 0.6, 0.6),
  });

  return doc.save();
};

const generateWeeklyReport = async (student) => {
  const weekEnd = new Date();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const moods = await Mood.find({
    user: student._id,
    createdAt: { $gte: weekStart, $lte: weekEnd },
  }).sort({ createdAt: 1 });

  const narrative = await generateNarrative(student.name, moods);
  const pdfBytes = await buildPdf({ studentName: student.name, weekStart, weekEnd, narrative, moods });

  const reportsDir = path.join(__dirname, '..', 'uploads', 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });
  const fileName = `wellness-${student._id}-${weekEnd.toISOString().split('T')[0]}.pdf`;
  fs.writeFileSync(path.join(reportsDir, fileName), pdfBytes);

  const fileUrl = `/uploads/reports/${fileName}`;

  const report = await WellnessReport.create({
    student: student._id,
    weekStart,
    weekEnd,
    narrative,
    fileUrl,
  });

  return report;
};

module.exports = { generateWeeklyReport };
