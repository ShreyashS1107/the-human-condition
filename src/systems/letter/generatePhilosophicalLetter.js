import { generateLocalPhilosophicalLetter } from './localLetterGenerator';
import { generateGeminiPhilosophicalLetter } from './geminiProvider';

export async function generatePhilosophicalLetter(answersMap, sessionData = {}) {
  // Free-first principle: Attempt optional provider if enabled, otherwise use local generator
  try {
    if (typeof window !== 'undefined' && window.__ENABLE_REMOTE_AI__) {
      return await generateGeminiPhilosophicalLetter(answersMap, sessionData);
    }
  } catch (e) {
    console.info('[PhilosophicalLetter] Remote provider unavailable, using local synthesis engine.');
  }

  // Guaranteed deterministic local analysis
  return generateLocalPhilosophicalLetter(answersMap, sessionData);
}
