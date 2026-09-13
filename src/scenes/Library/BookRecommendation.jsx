import React from 'react';
import { useExperience } from '../../hooks/useExperience';
import { soundEngine } from '../../systems/audioEngine';

export function BookRecommendation({ book, onClose }) {
  const { discoverBook, discoverQuote, discoveredBooks } = useExperience();
  const isCollected = discoveredBooks.includes(book.id);

  const handleCollect = () => {
    soundEngine.playSubtlePulse(180, 1.8, 0.2);
    discoverBook(book.id);
    if (book.verifiedQuote) {
      discoverQuote({
        id: book.id,
        quote: book.verifiedQuote,
        author: book.author,
        source: book.title,
      });
    }
  };

  return (
    <div className="book-modal-backdrop" onClick={onClose} role="dialog" aria-label={`Inspect ${book.title}`}>
      <div className="book-modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="book-modal-eyebrow">// PRESERVED MANUSCRIPT // {book.year}</p>
        <h2 className="book-modal-title">{book.title}</h2>
        <p className="book-modal-author">{book.author} — {book.subtext}</p>

        {book.verifiedQuote && (
          <blockquote className="book-modal-quote">
            "{book.verifiedQuote}"
          </blockquote>
        )}

        <p className="book-modal-summary">
          {book.summary}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-ritual"
            onClick={handleCollect}
            style={{
              borderColor: isCollected ? 'var(--gold-dim)' : 'var(--gold-accent)',
              color: isCollected ? 'var(--text-muted)' : '#ffffff',
            }}
          >
            {isCollected ? 'COLLECTED IN MEMORY ✓' : 'COLLECT CODEX INTO MEMORY'}
          </button>
          <button
            type="button"
            className="btn-ritual"
            onClick={onClose}
          >
            CLOSE CODEX
          </button>
        </div>
      </div>
    </div>
  );
}
