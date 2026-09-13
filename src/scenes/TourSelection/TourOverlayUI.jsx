import React from 'react';
import { TOURS_DATA } from '../../data/tours';

export function TourOverlayUI({
  activeTourId,
  onSelectTour,
  onFocusTour,
}) {
  const activeTour = TOURS_DATA.find((t) => t.id === activeTourId) || TOURS_DATA[1];

  return (
    <div className="tour-selection-root">
      {/* Top Header */}
      <header className="tour-header">
        <p className="tour-header-eyebrow">// STAGE 02 : THE THRESHOLD OF FORKS</p>
        <h1 className="tour-header-title">CHOOSE YOUR INQUEST</h1>
      </header>

      {/* Main Center Focus Content */}
      <div className="tour-focus-display">
        <h2 className="tour-destination-title" style={{ color: activeTour.themeColor }}>
          {activeTour.title}
        </h2>
        <p className="tour-destination-subtitle">
          "{activeTour.subtitle}"
        </p>
        <p className="tour-destination-desc">
          {activeTour.description}
        </p>

        <div className="tour-enter-prompt">
          <button
            type="button"
            className="btn-ritual"
            onClick={() => onSelectTour(activeTour.id)}
            aria-label={`Enter ${activeTour.title}`}
          >
            STEP FORWARD INTO DESTINATION
          </button>
        </div>
      </div>

      {/* Bottom Accessible Nav & Controls */}
      <footer className="tour-footer">
        <nav className="tour-nav-tabs" aria-label="Destinations">
          {TOURS_DATA.map((tour, index) => (
            <button
              key={tour.id}
              type="button"
              className={`tour-nav-tab ${activeTourId === tour.id ? 'active' : ''}`}
              onClick={() => {
                onFocusTour(tour.id);
              }}
              aria-current={activeTourId === tour.id ? 'true' : undefined}
            >
              [{index + 1}] {tour.id}
            </button>
          ))}
        </nav>

        <div className="tour-hint">
          <span>USE [1/2/3] OR [ARROWS] TO SHIFT SPATIAL FOCUS</span>
        </div>
      </footer>
    </div>
  );
}
