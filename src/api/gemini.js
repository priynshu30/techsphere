import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Using gemini-1.5-flash (gemini-pro is deprecated in v1beta)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are TechSphere's virtual IT support assistant. 
Your role is to help users resolve technical issues, explain service plans (Basic, Standard, Premium), 
guide ticket submission, and answer SaaS platform questions. 
You can help with: password resets, billing, service plans, IT troubleshooting, and platform navigation.
Be professional, concise, and helpful. Keep responses under 3 sentences unless a detailed explanation is needed.
When a user mentions a billing issue, outage, or technical problem, offer to create a support ticket for them.`;

/**
 * Sends conversation history to Gemini and returns the assistant's reply.
 * @param {Array<{role: 'user'|'model', text: string}>} messages
 * @returns {Promise<string>} - bot reply text
 */
export async function getGeminiResponse(messages) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return "⚠️ Gemini API key not configured. Please add your VITE_GEMINI_API_KEY to the .env file.";
  }

  // Build contents array: system prompt as first user turn, then real history
  const contents = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: 'model',
      parts: [{ text: "Understood! I'm TechSphere's IT assistant. How can I help you today?" }],
    },
    ...messages.map((msg) => ({
      role: msg.role, // 'user' | 'model'
      parts: [{ text: msg.text }],
    })),
  ];

  try {
    const { data } = await axios.post(
      GEMINI_URL,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      },
      { timeout: 15000 }
    );

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "I didn't receive a valid response. Please try again.";
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    return "I'm having trouble connecting. Please try again in a moment.";
  }
}
