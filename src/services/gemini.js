const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

export async function expandToSentence(rawInput) {
  if (!rawInput || rawInput.trim().length < 2) return '';
  if (!API_KEY) {
    console.error('Gemini API key missing — check .env file');
    return '';
  }

  const prompt = `AAC assistant for ALS patients. Expand abbreviated eye-typed input into one natural first-person sentence (under 20 words). Never explain, never add quotes. Always attempt an expansion.

Examples: BATHRM→I need to use the bathroom. WAT→I would like some water please. PAIN→I am in pain and need help. MOM→I want to speak with my mom. HUNGR→I am hungry and would like something to eat. HELP→I need help right now.

Input: "${rawInput.trim()}"
Sentence:`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 60,
          topP: 0.8,
          topK: 20,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE'
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      return '';
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Clean up any accidental quotes or extra punctuation Gemini adds
    return text
      ? text.replace(/^["']|["']$/g, '').trim()
      : '';

  } catch (err) {
    console.error('Gemini fetch failed:', err);
    return '';
  }
}