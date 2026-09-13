import React from 'react';
import { ENDING_VERSE } from './endingData';

export function EndingTypography({
  showTranslation = false,
  showFinalWords = false,
}) {
  return (
    <>
      {/* English Translation */}
      <section
        className={`ending-translation-block ${showTranslation ? 'opacity-100' : 'opacity-0'}`}
        lang="en"
        aria-label="Verse English Translation"
      >
        {ENDING_VERSE.translation.map((line, idx) => (
          <div key={idx} className="ending-translation-line">
            {line}
          </div>
        ))}
      </section>

      {/* "THE END" */}
      {showFinalWords && (
        <div
          className="ending-final-words-block opacity-100"
          aria-label="The End"
        >
          {ENDING_VERSE.finalWords}
        </div>
      )}
    </>
  );
}
