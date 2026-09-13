import React from 'react';
import { MUSEUM_ROOMS_DATA } from '../../data/museumRooms';
import { useExperience } from '../../hooks/useExperience';

export function MuseumNavHUD({
  activeRoomId,
  onSelectRoom,
  onProceedToBook,
}) {
  const { visitedMuseumRooms } = useExperience();

  const activeRoom = MUSEUM_ROOMS_DATA.find((r) => r.id === activeRoomId);

  return (
    <div className={`museum-root ${activeRoom ? 'in-encounter' : 'in-overview'}`}>
      {/* Header - Only visible in Void Overview */}
      {!activeRoom && (
        <header className="museum-header">
          <div className="museum-header-meta">
            <p className="museum-eyebrow">// STAGE 04 : THE VOID OF MONUMENTS</p>
            <h1 className="museum-title">THE MUSEUM OF LOST IDEAS</h1>
            <p className="museum-subtitle">
              "Where humanity keeps the questions it never answered."
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--gold-dim)' }}>
              CHAMBERS EXPLORED: {visitedMuseumRooms.length} / {MUSEUM_ROOMS_DATA.length}
            </p>
          </div>
        </header>
      )}

      {/* Active Chamber Banner - Subdued, non-intrusive lower scrim */}
      {activeRoom && (
        <div className="museum-chamber-banner" role="region" aria-label={activeRoom.title}>
          <div className="museum-chamber-meta-badge" style={{ borderColor: activeRoom.themeColor }}>
            <span className="font-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: activeRoom.themeColor }}>
              CHAMBER // {activeRoom.concept.toUpperCase()}
            </span>
          </div>
          <h2 className="museum-chamber-title" style={{ color: activeRoom.themeColor }}>
            {activeRoom.title}
          </h2>
          <p className="museum-chamber-subtext">
            "{activeRoom.subtext}"
          </p>
          <p className="museum-chamber-hint">
            // {activeRoom.hint} //
          </p>

          <button
            type="button"
            className="btn-ritual"
            onClick={() => onSelectRoom(null)}
            style={{ marginTop: '0.8rem', fontSize: '0.68rem', padding: '0.35rem 1.1rem' }}
          >
            ← RETURN TO VOID OVERVIEW [ESC]
          </button>
        </div>
      )}

      {/* Footer Navigation Tabs - Only shown in Overview */}
      {!activeRoom && (
        <footer className="museum-footer-nav">
          <nav className="room-selector-tabs" aria-label="Museum Chambers">
            {MUSEUM_ROOMS_DATA.map((room, idx) => {
              const isVisited = visitedMuseumRooms.includes(room.id);
              const isActive = activeRoomId === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  className={`room-tab-btn ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
                  onClick={() => onSelectRoom(isActive ? null : room.id)}
                  aria-pressed={isActive}
                >
                  [{idx + 1}] {room.id}
                </button>
              );
            })}
          </nav>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-ritual"
              onClick={onProceedToBook}
              style={{ borderColor: 'var(--gold-accent)', color: '#ffffff' }}
            >
              ENTER THE BOOK THAT READS YOU →
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
