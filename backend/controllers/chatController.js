const ChatMessage = require('../models/ChatMessage');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Crisis keywords for detection
const crisisKeywords = [
  'suicide',
  'kill myself',
  'end my life',
  'self harm',
  'hurt myself',
  'die',
  'hopeless',
];

// @desc    Send message to AI Chat
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Save user message
    await ChatMessage.create({
      user: req.user._id,
      role: 'user',
      message,
    });

    // 🚨 CRISIS DETECTION
    const lowerMessage = message.toLowerCase();

    const isCrisis = crisisKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (isCrisis) {
      const emergencyReply = `
I'm really sorry that you're feeling this way.
You are not alone, and help is available right now.

📞 Emergency Helpline (India):
• AASRA: 91-9820466726
• Kiran (Govt.): 1800-599-0019

Please consider reaching out to a trusted person or a medical professional.
You can also book an appointment with a campus doctor through this app.
`;

      await ChatMessage.create({
        user: req.user._id,
        role: 'assistant',
        message: emergencyReply,
      });

      return res.status(200).json({
        success: true,
        reply: emergencyReply,
        crisis: true,
      });
    }

    // 🧠 AI prompt (FIRST-AID style)
    const prompt = `
You are an AI-guided mental health first-aid assistant for college students.
You are NOT a doctor.
Be empathetic, calm, and supportive.
Offer simple coping techniques.
If the user shows distress, gently suggest professional help.

Student says: "${message}"
`;

    let aiReply;
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      aiReply = result.response.text();
    } catch (aiError) {
      // Fallback response if AI fails
      console.error('Gemini API error:', aiError);
      aiReply = "I understand you're going through a difficult time. While I'm here to listen, I recommend speaking with a counselor who can provide personalized support. Would you like help finding campus mental health resources?";
    }

    // Save AI response
    await ChatMessage.create({
      user: req.user._id,
      role: 'assistant',
      message: aiReply,
    });

    res.status(200).json({
      success: true,
      reply: aiReply,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'AI service error',
      error: error.message,
    });
  }
};

