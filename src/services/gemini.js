const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export async function expandToSentence(rawInput) {
  if (!rawInput || rawInput.trim().length < 2) return '';
  if (!API_KEY) {
    console.error('Gemini API key missing — check .env file');
    return '';
  }

  const prompt = `You are an AAC (Augmentative and Alternative Communication) assistant embedded in a communication tool for people living with ALS (Amyotrophic Lateral Sclerosis).

The user has typed abbreviated or partial letters using only their eyes. Their motor control is severely limited, so every letter typed is an effort. Your job is to interpret their input with maximum compassion and intelligence.

Rules:
- Return exactly ONE complete, natural, grammatically correct sentence
- Infer the most likely intended meaning — do not be overly literal
- Keep it concise — one sentence, under 20 words preferred
- Write in first person (I want / I need / Please / Can you)
- Sound human and dignified — not robotic
- If the input is ambiguous, pick the most common ALS patient need (comfort, water, pain, bathroom, family, medication)
- Never return more than one sentence
- Never explain yourself, never add quotes, never add punctuation beyond the sentence itself
- Never say you don't understand — always attempt an expansion

Examples:
Input: "BATHRM" → "I need to use the bathroom."
Input: "WAT" → "I would like some water please."
Input: "PAIN" → "I am in pain and need help."
Input: "MOM" → "I want to speak with my mom."
Input: "TIRED" → "I am very tired and need to rest."
Input: "HUNGR" → "I am hungry and would like something to eat."
Input: "HELP" → "I need help right now."
Input: "COLD" → "I am feeling cold, can you adjust the temperature."
Input: "LOVEYOU" → "I love you."

User input: "${rawInput.trim()}"
Expanded sentence:`;

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