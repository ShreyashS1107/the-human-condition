import React, { useState, useEffect, useCallback } from 'react';
import { useExperience } from '../hooks/useExperience';
import { TOURS_DATA } from '../data/tours';
import { TourOverlayUI } from './TourSelection/TourOverlayUI';
import { TourTransition } from './TourSelection/TourTransition';
import { soundEngine } from '../systems/audioEngine';
import '../styles/tourSelection.css';

export function TourSelectionScene() {
  const {
    setStage,
    setSelectedTour,
    focusedTourId = 'MUSEUM',
    setFocusedTour,
    recordAnswer,
    stages,
  } = useExperience();

  const [selectedTourObj, setSelectedTourObj] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleFocus = useCallback((tourId) => {
    setFocusedTour(tourId);
    soundEngine.playPortalHover(tourId);
  }, [setFocusedTour]);

  const handleSelect = useCallback((tourId) => {
    if (isTransitioning) return;
    const tour = TOURS_DATA.find((t) => t.id === tourId);
    if (!tour) return;

    setSelectedTour(tour.id);
    setSelectedTourObj(tour);
    recordAnswer('tour_chosen', tour.id, 0, tour.id === 'LIBRARY' ? 'determinism' : tour.id === 'BOOK' ? 'determinism' : 'free_will');
    setIsTransitioning(true);
  }, [isTransitioning, setSelectedTour, recordAnswer]);

  const handleTransitionComplete = useCallback(() => {
    if (selectedTourObj) {
      setStage(stages[selectedTourObj.stageTarget] || stages.LIBRARY);
    }
  }, [selectedTourObj, setStage, stages]);

  // Global Keyboard Navigation for 3D destinations
  useEffect(() => {
    function handleKeyDown(e) {
      if (isTransitioning) return;

      if (e.key === '1') handleFocus('LIBRARY');
      if (e.key === '2') handleFocus('MUSEUM');
      if (e.key === '3') handleFocus('BOOK');

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const idx = TOURS_DATA.findIndex((t) => t.id === focusedTourId);
        const nextIdx = (idx + 1) % TOURS_DATA.length;
        handleFocus(TOURS_DATA[nextIdx].id);
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const idx = TOURS_DATA.findIndex((t) => t.id === focusedTourId);
        const prevIdx = (idx - 1 + TOURS_DATA.length) % TOURS_DATA.length;
        handleFocus(TOURS_DATA[prevIdx].id);
      }

      if (e.key === 'Enter') {
        handleSelect(focusedTourId);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, focusedTourId, handleFocus, handleSelect]);

  useEffect(() => {
    setSelectedTour(null);
  }, [setSelectedTour]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {!isTransitioning && (
        <TourOverlayUI
          activeTourId={focusedTourId}
          onFocusTour={handleFocus}
          onSelectTour={handleSelect}
        />
      )}

      {isTransitioning && (
        <TourTransition
          targetTour={selectedTourObj}
          onComplete={handleTransitionComplete}
          duration={2200}
        />
      )}
    </div>
  );
}
