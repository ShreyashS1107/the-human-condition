import React from 'react';

export function FinaleTypography({
  phase,
  currentFragment,
}) {
  return (
    <div className="finale-root">
      {/* 1. Opening Intro Lines */}
      {phase === 'INTRO_1' && (
        <div className="finale-intro-card" key="intro1">
          <h1 className="finale-intro-text">
            YOU HAVE BEEN ANSWERING QUESTIONS.
          </h1>
        </div>
      )}

      {phase === 'INTRO_2' && (
        <div className="finale-intro-card" key="intro2">
          <h1 className="finale-intro-text">
            NOW ANSWER ONE WITHOUT THINKING.
          </h1>
        </div>
      )}

      {/* 2. Highlight Banner during Reconstruction */}
      {(phase === 'RECONSTRUCT' || phase === 'ACCELERATE') && currentFragment && (
        <div className="finale-active-fragment-banner" key={currentFragment.id || currentFragment.text}>
          <p className="fragment-type-tag">// RECONSTRUCTING: {currentFragment.type} //</p>
          <h2 className="fragment-quote-text">
            "{currentFragment.text}"
          </h2>
        </div>
      )}

      {/* 3. Central Climax Questions */}
      {phase === 'QUESTION_1' && (
        <div className="finale-central-question-container" key="q1">
          <h1 className="central-question-text">
            WHAT IF YOU ARE WRONG ABOUT YOURSELF?
          </h1>
        </div>
      )}

      {phase === 'QUESTION_2' && (
        <div className="finale-central-question-container" key="q2">
          <h1 className="central-question-text" style={{ color: '#ffffff' }}>
            WHAT IF YOU ARE WRONG ABOUT EVERYTHING?
          </h1>
        </div>
      )}
    </div>
  );
}
