import React from 'react';

export function FinaleBreakdown({ fragments = [] }) {
  // Display a corrupted cascade of the user's actual journey elements
  const displayItems = fragments.slice(0, 6);

  return (
    <div className="breakdown-matrix">
      <div className="breakdown-text-line" style={{ transform: 'rotate(-2deg)' }}>
        [SYSTEM DEREGULATION // VOID OVERFLOW]
      </div>

      {displayItems.map((item, idx) => (
        <div
          key={idx}
          className="breakdown-text-line"
          style={{
            animationDelay: `${idx * 0.08}s`,
            transform: `translateX(${(idx % 2 === 0 ? 1 : -1) * (idx * 15)}px) rotate(${idx % 2 === 0 ? 1.5 : -1.5}deg)`,
            color: idx % 2 === 0 ? '#ff3b3b' : '#ede5d3',
          }}
        >
          {item.text.toUpperCase()}
        </div>
      ))}

      <div className="breakdown-text-line" style={{ transform: 'rotate(2deg)', color: '#ffffff' }}>
        WHAT IF YOU ARE WRONG ABOUT EVERYTHING?
      </div>
    </div>
  );
}
