/**
 * Extracts authentic fragments from JourneyMemory for Stage 06: The Nietzsche Machine
 */
export function extractJourneyFragments({
  bookAnswers = {},
  answers = {},
  visitedPhilosophers = [],
  visitedMuseumRooms = [],
  discoveredBooks = [],
  bookContradictions = [],
  bookThemes = [],
  selectedTour = null,
} = {}) {
  const list = [];

  // 1. User's actual typed confessions from the Book
  if (bookAnswers?.fear?.answer) {
    list.push({ type: 'USER_ANSWER', text: bookAnswers.fear.answer, id: 'fear' });
  }
  if (bookAnswers?.desire?.answer) {
    list.push({ type: 'USER_ANSWER', text: bookAnswers.desire.answer, id: 'desire' });
  }
  if (bookAnswers?.loved_vs_understood?.answer) {
    list.push({ type: 'USER_ANSWER', text: bookAnswers.loved_vs_understood.answer, id: 'loved' });
  }
  if (bookAnswers?.legacy_oblivion?.answer) {
    list.push({ type: 'USER_ANSWER', text: bookAnswers.legacy_oblivion.answer, id: 'legacy' });
  }
  if (bookAnswers?.freedom_vs_belonging?.answer) {
    list.push({ type: 'USER_ANSWER', text: bookAnswers.freedom_vs_belonging.answer, id: 'freedom' });
  }

  // Check general answers map for any additional prompt responses
  if (answers) {
    Object.entries(answers).forEach(([key, val]) => {
      if (val?.answer && typeof val.answer === 'string' && val.answer.trim().length > 0) {
        // avoid duplicates
        if (!list.some((item) => item.text === val.answer)) {
          list.push({ type: 'USER_ANSWER', text: val.answer, id: `ans_${key}` });
        }
      }
    });
  }

  // Graceful fallback if user skipped stages directly to finale
  if (list.length === 0) {
    list.push(
      { type: 'USER_ANSWER', text: 'I want freedom', id: 'f1' },
      { type: 'USER_ANSWER', text: 'Being forgotten', id: 'f2' }
    );
  }

  // 2. Visited Philosophers
  if (visitedPhilosophers && visitedPhilosophers.length > 0) {
    visitedPhilosophers.forEach((pId) => {
      list.push({ type: 'PHILOSOPHER', text: pId.toUpperCase(), id: `p_${pId}` });
    });
  } else {
    list.push(
      { type: 'PHILOSOPHER', text: 'SOCRATES', id: 'p_soc' },
      { type: 'PHILOSOPHER', text: 'NIETZSCHE', id: 'p_nietz' }
    );
  }

  // 3. Discovered Museum Rooms
  if (visitedMuseumRooms && visitedMuseumRooms.length > 0) {
    visitedMuseumRooms.forEach((rId) => {
      list.push({ type: 'MUSEUM_ROOM', text: rId.toUpperCase(), id: `r_${rId}` });
    });
  } else {
    list.push(
      { type: 'MUSEUM_ROOM', text: 'MEANING', id: 'r_m' },
      { type: 'MUSEUM_ROOM', text: 'DEATH', id: 'r_d' }
    );
  }

  // 4. Discovered Books
  if (discoveredBooks && discoveredBooks.length > 0) {
    discoveredBooks.forEach((bId) => {
      list.push({ type: 'BOOK', text: bId.replace(/_/g, ' ').toUpperCase(), id: `b_${bId}` });
    });
  }

  // 5. Contradictions & Themes
  if (bookContradictions && bookContradictions.length > 0) {
    list.push({ type: 'CONTRADICTION', text: bookContradictions[0], id: 'contra_1' });
  }
  if (bookThemes && bookThemes.length > 0) {
    list.push({ type: 'THEME', text: bookThemes[0].toUpperCase(), id: 'theme_1' });
  }
  if (selectedTour) {
    list.push({ type: 'CHOSEN_INQUEST', text: selectedTour.toUpperCase(), id: 'tour' });
  }

  return list;
}
