import React from 'react';

export function DialogueChoice({ option, index, onSelect }) {
  return (
    <button
      type="button"
      className="dialogue-choice-btn"
      onClick={() => onSelect(option)}
      aria-label={`Option ${index + 1}: ${option.text}`}
    >
      <span>
        <span className="dialogue-choice-number">[{index + 1}]</span>
        {option.text}
      </span>
      <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>→</span>
    </button>
  );
}
