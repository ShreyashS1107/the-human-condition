import React, { useState, useEffect, useCallback } from 'react';
import { useExperience } from '../hooks/useExperience';
import { ChoiceManipulation } from './Opening/ChoiceManipulation';
import { OpeningTransition } from './Opening/OpeningTransition';
import { soundEngine } from '../systems/audioEngine';
import '../styles/opening.css';

export function OpeningScene() {
  const { setStage, stages, recordAnswer, updateMetrics } = useExperience();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initial atmospheric black delay before revealing the prompt
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
      soundEngine.startOpeningRoomTone();
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  const handleChooseYes = useCallback(() => {
    soundEngine.playEntranceResonance();
    recordAnswer('opening_entrance', 'YES', 5, 'free_will');
    setIsTransitioning(true);
  }, [recordAnswer]);

  const handleResolveManipulation = useCallback(() => {
    // Recorded when "I DON'T KNOW" is dissolved and user enters involuntarily
    recordAnswer('opening_entrance', 'MANIPULATED_INTO_YES', -10, 'determinism');
    updateMetrics({ rebellionCount: 1 });
    setIsTransitioning(true);
  }, [recordAnswer, updateMetrics]);

  const handleTransitionComplete = useCallback(() => {
    setStage(stages.TOUR_SELECTION);
  }, [setStage, stages.TOUR_SELECTION]);

  // Global keyboard shortcuts for quick accessible interaction
  useEffect(() => {
    function handleKeyDown(e) {
      if (isTransitioning || !isRevealed) return;

      if (e.key === '1') {
        handleChooseYes();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, isRevealed, handleChooseYes]);

  return (
    <div
      className="opening-root"
      style={{
        opacity: isRevealed ? 1 : 0,
      }}
    >
      <ChoiceManipulation
        onChooseYes={handleChooseYes}
        onResolveManipulation={handleResolveManipulation}
        isLocked={isTransitioning || !isRevealed}
      />

      {isTransitioning && (
        <OpeningTransition onComplete={handleTransitionComplete} duration={2000} />
      )}
    </div>
  );
}
