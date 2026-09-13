import React from 'react';
import { useExperience } from '../hooks/useExperience';

export function CinematicOverlay() {
  const { currentStage, stages, selectedTour, metrics } = useExperience();

  const isVoidStage =
    currentStage === stages.OPENING ||
    currentStage === stages.FINALE ||
    currentStage === stages.ENDING;

  const isEndingStage = currentStage === stages.ENDING;

  return (
    <>
      {!isEndingStage && <div className="vignette-overlay" />}

      {/* Top minimal status marker - only visible during active exploration stages */}
      {!isVoidStage && (
        <header
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '2rem',
            right: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          <div
            className="font-mono"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--text-dim)' }}
          >
            THE HUMAN CONDITION // {currentStage}
          </div>
          {selectedTour && (
            <div
              className="font-mono"
              style={{ fontSize: '0.65rem', color: 'var(--gold-dim)', letterSpacing: '0.15em' }}
            >
              INQUEST: {selectedTour} | WILL INDEX: {metrics.agencyScore}%
            </div>
          )}
        </header>
      )}
    </>
  );
}
