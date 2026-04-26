const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getGeminiResponse(history) {
  // The current frontend passes a history array, but the new backend expects a single prompt string.
  // We'll extract the latest message text to remain compatible.
  const prompt = Array.isArray(history) ? history[history.length - 1].text : history;

  const response = await fetch(`${BACKEND_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  const data = await response.json();
  
  // Extract the text content from the Gemini response to avoid UI crashes.
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting. Please try again in a moment.";
}
