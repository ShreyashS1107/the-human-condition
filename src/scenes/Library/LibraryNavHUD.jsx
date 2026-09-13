import React from 'react';
import { PHILOSOPHERS_DIALOGUE_DATA } from '../../data/philosophersDialogue';
import { useExperience } from '../../hooks/useExperience';

export function LibraryNavHUD({
  activePhilosopherId,
  onSelectPhilosopher,
  onProceedToMuseum,
}) {
  const { visitedPhilosophers, discoveredBooks } = useExperience();

  return (
    <div className={`library-root ${activePhilosopherId ? 'in-encounter' : 'in-overview'}`}>
      {/* Header - Only visible in Grand Hall Overview */}
      {!activePhilosopherId && (
        <header className="library-header">
          <div className="library-header-meta">
            <p className="library-eyebrow">// STAGE 03 : THE ARCHIVE OF SOULS</p>
            <h1 className="library-title">THE LIBRARY OF HUMAN THOUGHT</h1>
            <p className="library-subtitle">
              "Where the dead still have questions for the living."
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--gold-dim)' }}>
              SANCTUARIES EXAMINED: {visitedPhilosophers.length} / {PHILOSOPHERS_DIALOGUE_DATA.length}
            </p>
            <p className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              CODICES COLLECTED: {discoveredBooks.length}
            </p>
          </div>
        </header>
      )}

      {/* Footer Navigation - Only shown in Grand Hall Overview */}
      {!activePhilosopherId && (
        <footer className="library-footer-nav">
          <nav className="philosopher-selector-tabs" aria-label="Philosophers">
            {PHILOSOPHERS_DIALOGUE_DATA.map((p, idx) => {
              const isVisited = visitedPhilosophers.includes(p.id);
              const isActive = activePhilosopherId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`philosopher-tab-btn ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
                  onClick={() => onSelectPhilosopher(isActive ? null : p.id)}
                  aria-pressed={isActive}
                >
                  [{idx + 1}] {p.name.toUpperCase()}
                </button>
              );
            })}
          </nav>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-ritual"
              onClick={onProceedToMuseum}
              style={{ borderColor: 'var(--gold-accent)', color: '#ffffff' }}
            >
              PROCEED TO MUSEUM OF LOST IDEAS →
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
