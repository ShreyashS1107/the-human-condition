import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../systems/audioEngine';

export function BookAnswerInput({
  questionPrompt,
  hint,
  placeholder,
  onSubmit,
  isLocked = false,
}) {
  const [value, setValue] = useState('');
  const [isSettling, setIsSettling] = useState(false);
  const textareaRef = useRef();

  useEffect(() => {
    setValue('');
    setIsSettling(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [questionPrompt]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!value.trim() || isLocked || isSettling) return;

    soundEngine.playSubtlePulse(140, 1.4, 0.2);
    setIsSettling(true);

    // Let ink settle into page visually before triggering page turn
    setTimeout(() => {
      onSubmit(value.trim());
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="book-page-container">
      {/* Socratic Question Prompt */}
      <h2
        className="book-question-prompt"
        style={{
          opacity: isSettling ? 0.4 : 1,
        }}
      >
        {questionPrompt}
      </h2>

      {hint && !isSettling && (
        <p className="book-question-hint">
          {hint}
        </p>
      )}

      {/* Ink Text Area */}
      <form className="book-ink-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Write your confession into the page...'}
          rows={2}
          disabled={isLocked || isSettling}
          className="book-ink-textarea"
          style={{
            opacity: isSettling ? 0.7 : 1,
            color: isSettling ? 'var(--gold-accent)' : '#f7f4ec',
          }}
          aria-label={questionPrompt}
        />

        <button
          type="submit"
          disabled={!value.trim() || isLocked || isSettling}
          className="book-submit-btn"
        >
          {isSettling ? 'INK SETTLING INTO FIBERS...' : 'IMPRINT INTO THE CODEX ↵'}
        </button>
      </form>
    </div>
  );
}
