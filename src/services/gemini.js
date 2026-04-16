const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

async function fetchWithRetry(url, options, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      // Rate-limited — parse retry-after if present, else wait 5s
      const body = await response.json().catch(() => ({}));
      const msg = body?.error?.message || '';
      const match = msg.match(/retry in ([\d.]+)s/i);
      const waitSec = match ? Math.min(parseFloat(match[1]), 20) : 5;
      console.warn(`Gemini rate-limited. Retrying in ${waitSec}s… (attempt ${attempt + 1}/${retries + 1})`);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, waitSec * 1000));
        continue;
      }
      // Exhausted retries — return a synthetic error response
      return { ok: false, status: 429, _body: body };
    }

    return response;
  }
}

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
    const result = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 512,
          topP: 0.8,
          topK: 20,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    // Handle synthetic error from retry exhaustion
    if (!result.ok) {
      const status = result.status;
      const errBody = result._body || await result.json().catch(() => ({}));
      console.error(`Gemini API error ${status}:`, errBody?.error?.message || errBody);
      if (status === 429) return '[Rate limited — please wait a moment and try again]';
      return '';
    }

    const data = await result.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return text ? text.replace(/^["']|["']$/g, '').trim() : '';

  } catch (err) {
    console.error('Gemini fetch failed:', err);
    return '';
  }
}