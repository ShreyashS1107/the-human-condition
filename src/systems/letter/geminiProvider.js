// Optional Gemini AI Provider Client
// NOTE: For security, client-side code will NOT expose API keys directly.
// This interface is configured for an optional backend endpoint or local execution.

export async function generateGeminiPhilosophicalLetter(answersMap, sessionData = {}) {
  // If backend endpoint is configured:
  const endpoint = '/api/philosophical-letter';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: answersMap,
        session: sessionData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini endpoint returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // If backend endpoint is unavailable, let caller fallback to local generator
    throw err;
  }
}
