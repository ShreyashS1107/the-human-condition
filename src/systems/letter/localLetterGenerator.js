// Local Deterministic Philosophical Letter Generator
// Analyzes user answers, extracts thematic tensions and recurring motifs,
// and synthesizes a 500-800 word philosophical letter formatted as manuscript pages.

export function generateLocalPhilosophicalLetter(answersMap, sessionData = {}) {
  const fear = answersMap.fear || 'uncertainty and loss of control';
  const desire = answersMap.desire || 'authentic meaning';
  const lovedOrUnderstood = answersMap.loved_vs_understood || 'to be truly understood';
  const legacy = answersMap.legacy_oblivion || 'a quiet footprint in the dark';
  const fearReflection = answersMap.memory_dynamic_1 || 'a necessary defense';
  const freedomSolitude = answersMap.freedom_vs_belonging || 'freedom remains non-negotiable';
  const authorship = answersMap.self_authorship || 'a blend of inherited habits and chosen acts';
  const eraseDecision = answersMap.final_choice || 'I must keep the burden to keep myself';

  // Analysis of tensions
  const textCorpus = Object.values(answersMap).join(' ').toLowerCase();

  const themes = [];
  if (textCorpus.includes('alone') || textCorpus.includes('lonely') || textCorpus.includes('isolat')) {
    themes.push('Solitude & Sanctuary');
  }
  if (textCorpus.includes('free') || textCorpus.includes('control') || textCorpus.includes('choic')) {
    themes.push('The Burden of Sovereignty');
  }
  if (textCorpus.includes('love') || textCorpus.includes('understand') || textCorpus.includes('belong')) {
    themes.push('The Ache for Witness');
  }
  if (textCorpus.includes('mean') || textCorpus.includes('matter') || textCorpus.includes('remember')) {
    themes.push('The Hunger for Permanence');
  }
  if (themes.length === 0) {
    themes.push('The Paradox of Authorship', 'The Fragility of Knowledge');
  }

  const contradictions = [];
  if (textCorpus.includes('free') && (textCorpus.includes('alone') || textCorpus.includes('love'))) {
    contradictions.push('You demand uncompromised freedom, yet dread the isolation required to maintain absolute autonomy.');
  }
  if (textCorpus.includes('understand') && textCorpus.includes('fear')) {
    contradictions.push('You yearn to be understood by another, yet your first instinct is to hide what frightens you most.');
  }
  if (contradictions.length === 0) {
    contradictions.push('You claim to author your own days, yet hesitate whenever asked where your deepest habits originated.');
  }

  // Page 1: The First Observation
  const page1 = `DEAR STRANGER,

I watched your ink settle into these fibers. When I asked what you feared, you wrote: "${fear}". When I asked what you wanted, you spoke of "${desire}".

Notice how swiftly we name our wants compared to how cautiously we admit our dread. We treat our desires as noble banners, but it is our fears that quietly design the rooms we live in. Your desire for ${desire} is not separate from your fear of ${fear}; it is the direct counter-weight you built to keep from looking into the dark.

You told me that between love and understanding, your inclination was towards "${lovedOrUnderstood}". Most who sit at this table demand love because love forgives what it does not examine. But to be understood is a far more dangerous hunger—it demands that someone look into the unpolished cellar of your thoughts and not turn away.`;

  // Page 2: The Core Tension
  const page2 = `ON THE ILLUSION OF SELF-AUTHORSHIP

When we discussed the weight of memory, you reflected that "${legacy}". Later, when I pressed you on whether total freedom is worth total solitude, you replied: "${freedomSolitude}".

Here is the knot in your manuscript: you wish to remain sovereign, yet you cannot bear the thought of an unpeopled universe. You want the dignity of an author who wrote every sentence of their character, yet when asked if you are reading an inherited script, you confessed that "${authorship}".

Is the author of a book truly free if every word was invented by dead ancestors centuries before their birth? You did not choose the language you think in. You did not choose the year you were cast into this world. Yet you take responsibility for the entire narrative. That is either humanity's supreme nobility or its most tragic delusion.`;

  // Page 3: The Closing Inquest
  const page3 = `THE FINAL THRESHOLD

When I asked if you would erase an old wound at the cost of forgetting who you are, you wrote: "${eraseDecision}".

In that single line, you surrendered the fantasy of a clean slate. You acknowledged that a human being is not an abstract ideal, but the accumulated debris of every error, every unspoken apology, and every silent compromise you ever made.

I do not offer you answers or absolution. I was not written to comfort you. I was written to hold a mirror until you see that you have been both the prisoner and the warden in every room you have entered.

Turn this page when you are ready. The book is closing, but the examination does not end in these leaves.`;

  const fullLetter = `${page1}\n\n---\n\n${page2}\n\n---\n\n${page3}`;

  return {
    letter: fullLetter,
    pages: [page1, page2, page3],
    themes,
    contradictions,
    wordCount: fullLetter.split(/\s+/).length,
    generatedAt: Date.now(),
    provider: 'local_deterministic_engine',
  };
}
