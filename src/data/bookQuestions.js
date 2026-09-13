// Socratic Inquest Questions for The Book That Reads You
// Questions dynamically reference previous answers to create active continuity.

export const BOOK_QUESTIONS = [
  {
    id: 'fear',
    prompt: 'WHAT ARE YOU AFRAID OF?',
    hint: 'Type what you hesitate to say aloud...',
    placeholder: 'Write your fear into the page...',
  },
  {
    id: 'desire',
    prompt: 'WHAT DO YOU WANT?',
    hint: 'Beyond survival and convenience...',
    placeholder: 'Write your desire into the page...',
  },
  {
    id: 'loved_vs_understood',
    prompt: 'WOULD YOU RATHER BE LOVED OR UNDERSTOOD?',
    hint: 'If both cannot be held at once...',
    placeholder: 'Write your choice and why...',
  },
  {
    id: 'legacy_oblivion',
    prompt: 'IF NOBODY REMEMBERED YOU, WOULD YOUR LIFE HAVE MATTERED?',
    hint: 'Gazing into the final silence...',
    placeholder: 'Write your confession into the page...',
  },
  {
    id: 'memory_dynamic_1',
    // Dynamically references the user's fear from question 1
    getPrompt: (answers) => {
      const fearAns = answers.fear ? answers.fear.trim() : 'the unknown';
      return `YOU SAID YOU ARE AFRAID OF "${fearAns.toUpperCase()}".\n\nDOES THIS FEAR PROTECT YOU, OR IS IT THE WALL THAT CONFINES YOU?`;
    },
    hint: 'Examine the boundary of your caution...',
    placeholder: 'Reflect upon this fear...',
  },
  {
    id: 'freedom_vs_belonging',
    // Dynamically references fear and desire
    getPrompt: (answers) => {
      const desireAns = answers.desire ? answers.desire.trim() : 'autonomy';
      return `YOU CRAVE "${desireAns.toUpperCase()}".\n\nWOULD YOU STILL CHOOSE TOTAL FREEDOM IF IT MEANT NOBODY COULD EVER REMAIN BESIDE YOU?`;
    },
    hint: 'When independence demands isolation...',
    placeholder: 'Weigh freedom against solitude...',
  },
  {
    id: 'self_authorship',
    prompt: 'DID YOU WRITE YOUR OWN CHARACTER, OR ARE YOU MERELY READING A SCRIPT HANDED TO YOU BY OTHERS?',
    hint: 'The origins of your voice...',
    placeholder: 'Are you the author or the reader?...',
  },
  {
    id: 'final_choice',
    prompt: 'IF YOU COULD ERASE ONE DECISION FROM YOUR PAST AT THE COST OF FORGETTING WHO YOU ARE NOW, WOULD YOU DO IT?',
    hint: 'The price of regret versus identity...',
    placeholder: 'Would you pay the price?...',
  },
];
