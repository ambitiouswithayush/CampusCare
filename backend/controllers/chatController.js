const ChatMessage = require('../models/ChatMessage');
const Resource = require('../models/Resource');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getEmbedding, cosineSimilarity } = require('../utils/embeddings');
const { detectCrisisKeyword, flagChatKeyword } = require('../services/crisisDetection');

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Finds the resources most relevant to the student's message using
// embedding similarity (RAG retrieval step). Returns [] on any failure
// so chat still works even if embeddings aren't set up yet.
const findRelevantResources = async (message, topN = 3) => {
  try {
    const queryEmbedding = await getEmbedding(message);
    if (!queryEmbedding) return [];

    const resources = await Resource.find({ embedding: { $exists: true, $ne: [] } })
      .select('title description category link embedding');

    if (resources.length === 0) return [];

    const scored = resources
      .map((r) => ({
        resource: r,
        score: cosineSimilarity(queryEmbedding, r.embedding),
      }))
      .filter((r) => r.score > 0.5) // ignore weak/irrelevant matches
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return scored.map((s) => s.resource);
  } catch (error) {
    console.error('Resource retrieval failed:', error.message);
    return [];
  }
};

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
    const matchedKeyword = detectCrisisKeyword(message);

    if (matchedKeyword) {
      // Escalate: flags in admin dashboard + emails the counselor
      flagChatKeyword(req.user._id, matchedKeyword, message).catch((err) =>
        console.error('Crisis escalation failed:', err.message)
      );

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

    // 🔎 RAG retrieval: find resources in our library relevant to this message
    const relevantResources = await findRelevantResources(message);

    const resourceContext = relevantResources.length
      ? `\n\nRelevant resources available in our library (recommend one by name if it genuinely fits):\n${relevantResources
          .map((r) => `- "${r.title}" (${r.category}): ${r.description}`)
          .join('\n')}`
      : '';

    // 🧠 AI prompt (FIRST-AID style)
    const prompt = `
You are an AI-guided mental health first-aid assistant for college students.
You are NOT a doctor.
Be empathetic, calm, and supportive.
Offer simple coping techniques.
If the user shows distress, gently suggest professional help.
${resourceContext ? 'If one of the listed resources genuinely fits what the student needs, mention it by its exact title. Do not invent resources that are not listed.' : ''}
${resourceContext}

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
      recommendedResources: relevantResources.map((r) => ({
        _id: r._id,
        title: r.title,
        description: r.description,
        category: r.category,
        link: r.link,
      })),
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

