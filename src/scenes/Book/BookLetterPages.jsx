import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../systems/audioEngine';
import { narrationEngine } from '../../systems/voice/narrationEngine';

export function BookLetterPages({
  pages = [],
  themes = [],
  contradictions = [],
  onTurnPage,
  onFinishReading,
}) {
  const [currentPage, setCurrentPage] = useState(0);

  // Initialize spoken voice narration for the generated manuscript
  useEffect(() => {
    if (pages && pages.length > 0) {
      narrationEngine.startManuscriptNarration(
        pages,
        (folioIndex) => {
          setCurrentPage(folioIndex);
          soundEngine.playPageTurn();
        },
        () => {
          // Narration completed naturally
        }
      );
    }

    return () => {
      narrationEngine.stop();
    };
  }, [pages]);

  const handleNextPage = () => {
    soundEngine.playPageTurn();
    if (onTurnPage) onTurnPage(currentPage + 1);

    if (currentPage < pages.length - 1) {
      const nextIdx = currentPage + 1;
      setCurrentPage(nextIdx);
      narrationEngine.jumpToFolio(nextIdx);
    } else {
      narrationEngine.stop();
      if (onFinishReading) onFinishReading();
    }
  };

  const currentContent = pages[currentPage] || 'The pages have fallen silent.';

  return (
    <div className="book-page-container">
      {/* Active Manuscript Page Content */}
      <div className="letter-page-card" key={currentPage}>
        {currentContent}
      </div>

      {/* Footer Controls */}
      <div className="letter-footer-controls">
        <span className="letter-page-counter">
          FOLIO {currentPage + 1} OF {pages.length}
        </span>

        <button
          type="button"
          className="book-submit-btn"
          onClick={handleNextPage}
        >
          {currentPage < pages.length - 1 ? 'TURN THE PAGE →' : 'LET THE CODEX CLOSE ↵'}
        </button>
      </div>
    </div>
  );
}
