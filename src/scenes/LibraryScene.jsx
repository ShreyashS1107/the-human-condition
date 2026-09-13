import React, { useEffect, useCallback } from 'react';
import { useExperience } from '../hooks/useExperience';
import { PHILOSOPHERS_DIALOGUE_DATA } from '../data/philosophersDialogue';
import { LibraryNavHUD } from './Library/LibraryNavHUD';
import { DialogueSystem } from './Library/DialogueSystem';
import { BookRecommendation } from './Library/BookRecommendation';
import { soundEngine } from '../systems/audioEngine';
import '../styles/library.css';

export function LibraryScene() {
  const {
    setStage,
    stages,
    activePhilosopherId,
    setActivePhilosopher,
    inspectingBook,
    setInspectingBook,
  } = useExperience();

  useEffect(() => {
    soundEngine.setLibraryAtmosphere();
  }, []);

  const handleSelectPhilosopher = useCallback((id) => {
    setActivePhilosopher(id);
    if (id) {
      const p = PHILOSOPHERS_DIALOGUE_DATA.find((item) => item.id === id);
      if (p) soundEngine.playPhilosopherProximity(p);
    }
  }, [setActivePhilosopher]);

  const handleInspectBook = useCallback((book) => {
    setInspectingBook(book);
  }, [setInspectingBook]);

  const handleCloseBook = useCallback(() => {
    setInspectingBook(null);
  }, [setInspectingBook]);

  const handleProceedToMuseum = useCallback(() => {
    soundEngine.playTransitionSwell();
    setStage(stages.MUSEUM);
  }, [setStage, stages.MUSEUM]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (inspectingBook) {
        if (e.key === 'Escape') handleCloseBook();
        return;
      }

      if (activePhilosopherId) {
        if (e.key === 'Escape') handleSelectPhilosopher(null);
        return;
      }

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= PHILOSOPHERS_DIALOGUE_DATA.length) {
        handleSelectPhilosopher(PHILOSOPHERS_DIALOGUE_DATA[keyNum - 1].id);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectingBook, activePhilosopherId, handleCloseBook, handleSelectPhilosopher]);

  const activePhilosopher = PHILOSOPHERS_DIALOGUE_DATA.find(
    (p) => p.id === activePhilosopherId
  );

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* 2D HUD Overlay */}
      <LibraryNavHUD
        activePhilosopherId={activePhilosopherId}
        onSelectPhilosopher={handleSelectPhilosopher}
        onProceedToMuseum={handleProceedToMuseum}
      />

      {/* Active Dialogue Inquest */}
      {activePhilosopher && !inspectingBook && (
        <DialogueSystem
          philosopher={activePhilosopher}
          onClose={() => handleSelectPhilosopher(null)}
          onOpenBook={handleInspectBook}
        />
      )}

      {/* Physical Book Inspection Modal */}
      {inspectingBook && (
        <BookRecommendation
          book={inspectingBook}
          onClose={handleCloseBook}
        />
      )}
    </div>
  );
}
