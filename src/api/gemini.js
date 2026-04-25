import axios from 'axios';

const SYSTEM_PROMPT = `You are TechSphere's virtual IT support assistant. 
Your role is to help users resolve technical issues, explain service plans (Basic, Standard, Premium), 
guide ticket submission, and answer SaaS platform questions. 
You can help with: password resets, billing, service plans, IT troubleshooting, and platform navigation.
Be professional, concise, and helpful. Keep responses under 3 sentences unless a detailed explanation is needed.
When a user mentions a billing issue, outage, or technical problem, offer to create a support ticket for them.`;

export async function getGeminiResponse(messages) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_key' || !apiKey.startsWith('AIza')) {
    console.error("Gemini Error: VITE_GEMINI_API_KEY is missing or invalid.");
    return "⚠️ Gemini API key not configured or invalid. Please check your .env file.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
      role: msg.role === 'model' ? 'model' : 'user', 
      parts: [{ text: msg.text }],
    })),
  ];

  try {
    const { data } = await axios.post(
      url,
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
