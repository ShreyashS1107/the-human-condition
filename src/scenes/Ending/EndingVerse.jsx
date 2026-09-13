import React from 'react';
import { ENDING_VERSE } from './endingData';

export function EndingVerse({ visible = false }) {
  return (
    <article
      className={`ending-sanskrit-block ${visible ? 'opacity-100' : 'opacity-0'}`}
      lang="sa"
      aria-label="Mahabharata Sanskrit Verse"
    >
      {ENDING_VERSE.sanskrit.map((line, idx) => (
        <div key={idx} className="ending-sanskrit-line">
          {line}
        </div>
      ))}
    </article>
  );
}
