import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChoiceButton } from './ChoiceButton';
import { soundEngine } from '../../systems/audioEngine';

// Original atmospheric lines - carefully crafted, not attributed to anyone
const MANIPULATION_BEATS = [
  {
    reflection: 'Hesitation does not pause the clock. It only obscures the hand that turns it.',
    yesScale: 1.15,
    idkScale: 0.85,
    idkOpacity: 0.55,
    idkBlur: 0.5,
    idkTranslateY: 10,
  },
  {
    reflection: 'You search for a third doorway in a chamber constructed with only two.',
    yesScale: 1.35,
    idkScale: 0.65,
    idkOpacity: 0.25,
    idkBlur: 1.5,
    idkTranslateY: 24,
  },
  {
    reflection: 'The silence was never waiting for your consent.',
    yesScale: 1.55,
    idkScale: 0.4,
    idkOpacity: 0,
    idkBlur: 4,
    idkTranslateY: 40,
  },
];

export function ChoiceManipulation({
  onChooseYes,
  onResolveManipulation,
  isLocked = false,
}) {
  const [beatIndex, setBeatIndex] = useState(-1);
  const [isDissolved, setIsDissolved] = useState(false);
  const [headline, setHeadline] = useState('ARE YOU SURE YOU WANT TO ENTER?');
  const [activeReflection, setActiveReflection] = useState('');
  const timeoutRef = useRef(null);

  const handleIdkClick = useCallback(() => {
    if (isLocked || isDissolved) return;

    const nextIndex = beatIndex + 1;
    soundEngine.playManipulationBeat(nextIndex);

    if (nextIndex < MANIPULATION_BEATS.length) {
      setBeatIndex(nextIndex);
      setActiveReflection(MANIPULATION_BEATS[nextIndex].reflection);

      if (nextIndex === MANIPULATION_BEATS.length - 1) {
        // Final dissolution beat
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          setIsDissolved(true);
          // Psychological pause before the inevitable command
          timeoutRef.current = setTimeout(() => {
            setHeadline('CHOOSE YOUR TOUR.');
            setActiveReflection('');
            soundEngine.playSubtlePulse(88, 2.5, 0.2);

            // Give a moment for "CHOOSE YOUR TOUR." to imprint, then trigger transition
            timeoutRef.current = setTimeout(() => {
              if (onResolveManipulation) {
                onResolveManipulation();
              }
            }, 1800);
          }, 1400);
        }, 1200);
      }
    }
  }, [beatIndex, isLocked, isDissolved, onResolveManipulation]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentConfig = beatIndex >= 0 ? MANIPULATION_BEATS[beatIndex] : null;

  const yesScale = currentConfig ? currentConfig.yesScale : 1;
  const idkScale = currentConfig ? currentConfig.idkScale : 1;
  const idkOpacity = currentConfig ? currentConfig.idkOpacity : 0.75;
  const idkBlur = currentConfig ? currentConfig.idkBlur : 0;
  const idkTranslateY = currentConfig ? currentConfig.idkTranslateY : 0;

  return (
    <div className="opening-content">
      {/* Dynamic Headline */}
      <div className="opening-title-container">
        <h1 className="opening-title" key={headline}>
          {headline}
        </h1>
      </div>

      {/* Atmospheric Reflection Text */}
      <div className="opening-reflection-container" aria-live="polite">
        {activeReflection && (
          <p className="opening-reflection-text" key={activeReflection}>
            "{activeReflection}"
          </p>
        )}
      </div>

      {/* Choices */}
      <div className="opening-choices-group">
        <ChoiceButton
          type="yes"
          scale={yesScale}
          disabled={isLocked}
          onClick={onChooseYes}
          ariaLabel={headline === 'CHOOSE YOUR TOUR.' ? 'Enter Tour Selection' : 'Yes, enter the experience'}
        >
          {headline === 'CHOOSE YOUR TOUR.' ? 'ENTER' : 'YES'}
        </ChoiceButton>

        {!isDissolved && (
          <ChoiceButton
            type="idk"
            scale={idkScale}
            opacity={idkOpacity}
            blur={idkBlur}
            translateY={idkTranslateY}
            disabled={isLocked || beatIndex >= MANIPULATION_BEATS.length - 1}
            onClick={handleIdkClick}
            ariaLabel="I don't know"
          >
            I DON'T KNOW
          </ChoiceButton>
        )}
      </div>
    </div>
  );
}
