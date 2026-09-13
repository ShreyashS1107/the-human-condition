import React, { useState, useEffect, useCallback } from 'react';
import { DialogueChoice } from './DialogueChoice';
import { useExperience } from '../../hooks/useExperience';
import { soundEngine } from '../../systems/audioEngine';

export function DialogueSystem({
  philosopher,
  onClose,
  onOpenBook,
}) {
  const { recordAnswer, visitPhilosopher } = useExperience();
  const [currentNodeKey, setCurrentNodeKey] = useState('root');
  const [hasCompleted, setHasCompleted] = useState(false);

  const currentNode = philosopher.dialogue.nodes[currentNodeKey] || philosopher.dialogue.nodes.root;

  const handleSelectOption = useCallback((option) => {
    soundEngine.playSubtlePulse(philosopher.soundTone.freq * 1.2, 1.2, 0.15);

    // Record decision in global session state
    recordAnswer(
      `dialogue_${philosopher.id}_${currentNodeKey}`,
      option.text,
      0,
      philosopher.id === 'nietzsche' || philosopher.id === 'camus' ? 'free_will' : 'determinism'
    );

    const nextKey = option.nextNode;
    if (nextKey && philosopher.dialogue.nodes[nextKey]) {
      const nextNodeObj = philosopher.dialogue.nodes[nextKey];
      setCurrentNodeKey(nextKey);

      if (nextNodeObj.isEnd) {
        setHasCompleted(true);
        visitPhilosopher(philosopher.id);
      }
    }
  }, [currentNodeKey, philosopher, recordAnswer, visitPhilosopher]);

  // Keyboard navigation for dialogue options
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (currentNode && currentNode.options) {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= currentNode.options.length) {
          handleSelectOption(currentNode.options[keyNum - 1]);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentNode, handleSelectOption, onClose]);

  return (
    <div className="dialogue-modal-root" role="dialog" aria-label={`Dialogue with ${philosopher.name}`}>
      {/* Return to Grand Hall button */}
      <button
        type="button"
        className="dialogue-back-btn"
        onClick={onClose}
        aria-label="Return to Grand Hall"
      >
        ← RETURN TO GRAND HALL [ESC]
      </button>

      {/* Speaker Header */}
      <div className="dialogue-speaker-meta">
        <div>
          <span className="dialogue-speaker-name" style={{ color: philosopher.themeColor }}>
            {philosopher.name}
          </span>
          <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>//</span>
          <span className="font-serif" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {philosopher.era}
          </span>
        </div>
        <span className="dialogue-speaker-theme">{philosopher.theme}</span>
      </div>

      {/* Socratic Question Text */}
      <p className="dialogue-question-text">
        "{currentNode.question}"
      </p>

      {/* Choice Options or Conclusion Actions */}
      {!hasCompleted && currentNode.options ? (
        <div className="dialogue-choices-group">
          {currentNode.options.map((option, idx) => (
            <DialogueChoice
              key={idx}
              option={option}
              index={idx}
              onSelect={handleSelectOption}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-ritual"
            onClick={() => onOpenBook(philosopher.book)}
            style={{ borderColor: 'var(--gold-accent)', color: '#fff' }}
          >
            INSPECT PRESERVED CODEX
          </button>
          <button
            type="button"
            className="btn-ritual"
            onClick={onClose}
          >
            ← RETURN TO GRAND HALL
          </button>
        </div>
      )}
    </div>
  );
}
