import React, { useState, useEffect, useRef } from 'react';
import { EndingVerse } from './EndingVerse';
import { EndingTypography } from './EndingTypography';
import { SacredCeremonyBackground } from './SacredCeremonyBackground';
import { soundEngine } from '../../systems/audioEngine';
import { stopNarrative } from '../../systems/audio/narration';

/**
 * STAGE 07 Master Ceremonial Timeline:
 *
 * 1. INITIAL_BLACK (0.0s - 4.5s): Pure black stillness hold
 * 2. CEREMONY_EMERGE (4.5s - 7.5s): Sacred manuscript geometry & dust emerge in darkness
 * 3. SANSKRIT_IN (7.5s - 10.5s): Sacred Sanskrit verse materializes with soft radiance
 * 4. SANSKRIT_HOLD (10.5s - 16.5s): Sanskrit held in deep silence
 * 5. TRANSLATION_IN (16.5s - 19.5s): English translation materializes beneath
 * 6. FULL_HOLD (19.5s - 28.5s): Sanskrit and Translation held together in reverence
 * 7. TRANSLATION_OUT (28.5s - 31.5s): Translation fades away into darkness
 * 8. SANSKRIT_OUT (31.5s - 34.5s): Sanskrit fades away into darkness
 * 9. MID_BLACK (34.5s - 38.5s): Pure black stillness hold
 * 10. THE_END_IN (38.5s - 41.5s): "THE END" fades in
 * 11. THE_END_HOLD (41.5s - 47.0s): "THE END" held quietly
 * 12. THE_END_OUT (47.0s - 50.0s): "THE END" dissolves
 * 13. PERMANENT_BLACK (50.0s+): Complete, permanent black void. Absolute termination. Zero UI. Zero restart.
 */

export function EndingSequence() {
  const [phase, setPhase] = useState('INITIAL_BLACK');
  const timeoutsRef = useRef([]);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  useEffect(() => {
    // Stage 07 must be completely silent
    soundEngine.silenceAll();
    stopNarrative();

    // 1. Initial Black Hold -> 2. Geometry Emerges (4.5s)
    addTimeout(() => {
      setPhase('CEREMONY_EMERGE');

      // 3. Sanskrit Materializes (3.0s fade)
      addTimeout(() => {
        setPhase('SANSKRIT_IN');

        // 4. Sanskrit Fully In & Held in Reverence (3.0s)
        addTimeout(() => {
          setPhase('SANSKRIT_HOLD');

          // 5. English Translation Appears (6.0s hold -> translation in)
          addTimeout(() => {
            setPhase('TRANSLATION_IN');

            // 6. Full Verse Hold Together (3.0s fade -> hold together)
            addTimeout(() => {
              setPhase('FULL_HOLD');

              // 7. Translation Out (9.0s hold -> translation out)
              addTimeout(() => {
                setPhase('TRANSLATION_OUT');

                // 8. Sanskrit Out (3.0s fade -> sanskrit out)
                addTimeout(() => {
                  setPhase('SANSKRIT_OUT');

                  // 9. Mid Black Hold (3.0s fade -> black hold)
                  addTimeout(() => {
                    setPhase('MID_BLACK');

                    // 10. "THE END" In (4.0s hold -> "THE END" in)
                    addTimeout(() => {
                      setPhase('THE_END_IN');

                      // 11. "THE END" Hold (3.0s fade -> hold)
                      addTimeout(() => {
                        setPhase('THE_END_HOLD');

                        // 12. "THE END" Out (5.5s hold -> fade out)
                        addTimeout(() => {
                          setPhase('THE_END_OUT');

                          // 13. Absolute Permanent Black (3.0s fade -> permanent void)
                          addTimeout(() => {
                            setPhase('PERMANENT_BLACK');
                          }, 3000);
                        }, 5500);
                      }, 3000);
                    }, 4000);
                  }, 3000);
                }, 3000);
              }, 9000);
            }, 3000);
          }, 6000);
        }, 3000);
      }, 3000);
    }, 4500);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // Flags for component visibility
  const showSanskrit =
    phase === 'SANSKRIT_IN' ||
    phase === 'SANSKRIT_HOLD' ||
    phase === 'TRANSLATION_IN' ||
    phase === 'FULL_HOLD' ||
    phase === 'TRANSLATION_OUT';

  const showTranslation =
    phase === 'TRANSLATION_IN' ||
    phase === 'FULL_HOLD';

  const showFinalWords =
    phase === 'THE_END_IN' ||
    phase === 'THE_END_HOLD';

  if (phase === 'PERMANENT_BLACK') {
    return <div className="ending-permanent-black" aria-hidden="true" />;
  }

  return (
    <div className="ending-root">
      {/* Sacred Geometry Background System */}
      <SacredCeremonyBackground phase={phase} />

      <div className="ending-content-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        {/* Sanskrit Devanagari Verse */}
        {(showSanskrit || phase === 'SANSKRIT_OUT') && (
          <EndingVerse visible={showSanskrit} />
        )}

        {/* English Translation & Final Words */}
        <EndingTypography
          showTranslation={showTranslation}
          showFinalWords={showFinalWords}
        />
      </div>
    </div>
  );
}

