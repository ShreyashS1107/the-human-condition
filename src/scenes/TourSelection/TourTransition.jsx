import React, { useEffect } from 'react';
import { soundEngine } from '../../systems/audioEngine';

export function TourTransition({ targetTour, onComplete, duration = 2200 }) {
  useEffect(() => {
    soundEngine.playTransitionSwell();

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 50,
        pointerEvents: 'all',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `openingFadeThrough ${duration}ms var(--ease-cinematic) forwards`,
      }}
    >
      <p
        className="font-mono"
        style={{
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          color: 'var(--gold-accent)',
          marginBottom: '1rem',
        }}
      >
        // COMMITTING TO PATH //
      </p>
      <h3
        className="font-display"
        style={{
          fontSize: '1.4rem',
          letterSpacing: '0.25em',
          color: '#ede7db',
        }}
      >
        {targetTour ? targetTour.title : 'CROSSING THE THRESHOLD'}
      </h3>
    </div>
  );
}
