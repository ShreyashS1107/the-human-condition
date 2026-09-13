import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useExperience } from '../../hooks/useExperience';
import { FinaleTypography } from './FinaleTypography';
import { FinaleBreakdown } from './FinaleBreakdown';
import { soundEngine } from '../../systems/audioEngine';

import { extractJourneyFragments } from '../../systems/extractJourneyFragments';

export function FinaleSequence() {
  const {
    answers = {},
    bookAnswers = {},
    visitedPhilosophers = [],
    visitedMuseumRooms = [],
    discoveredBooks = [],
    selectedTour,
    bookThemes = [],
    bookContradictions = [],
    setFinaleState,
    setStage,
    stages,
  } = useExperience();

  const [phase, setPhase] = useState('INTRO_1');
  const [activeFragmentIndex, setActiveFragmentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Compile authentic JourneyMemory fragments
  const fragments = useMemo(() => {
    return extractJourneyFragments({
      bookAnswers,
      answers,
      visitedPhilosophers,
      visitedMuseumRooms,
      discoveredBooks,
      bookContradictions,
      bookThemes,
      selectedTour,
    });
  }, [bookAnswers, answers, visitedPhilosophers, visitedMuseumRooms, discoveredBooks, bookContradictions, bookThemes, selectedTour]);

  // Master Orchestration Timeline
  useEffect(() => {
    // Phase 1: Intro 1
    setPhase('INTRO_1');
    setFinaleState({ phase: 'INTRO_1', machineSpeed: 0.2, fragmentCount: 0, isCollapsing: false, isDestabilized: false });
    soundEngine.playSubtlePulse(55, 3.0, 0.15);

    // Phase 2: Intro 2 (3.5s)
    timeoutRef.current = setTimeout(() => {
      setPhase('INTRO_2');
      setFinaleState({ phase: 'INTRO_2', machineSpeed: 0.4 });
      soundEngine.playSubtlePulse(65, 3.0, 0.2);

      // Phase 3: Reconstruction & Rhythmic Build (7.5s)
      timeoutRef.current = setTimeout(() => {
        setPhase('RECONSTRUCT');
        soundEngine.startAmbient(2);
        soundEngine.startMachineRhythm(1.0);
        setFinaleState({ phase: 'RECONSTRUCT', machineSpeed: 1.0 });

        let currentIdx = 0;
        intervalRef.current = setInterval(() => {
          currentIdx += 1;
          setActiveFragmentIndex(currentIdx);
          setFinaleState({ fragmentCount: currentIdx });
          soundEngine.playSubtlePulse(110 + (currentIdx % 5) * 20, 0.8, 0.14);

          if (currentIdx >= fragments.length) {
            clearInterval(intervalRef.current);

            // Phase 4: Acceleration & Intensified Rhythm (16.5s)
            setPhase('ACCELERATE');
            setFinaleState({ phase: 'ACCELERATE', machineSpeed: 3.5 });
            soundEngine.startMachineRhythm(3.0);
            soundEngine.playFinaleAcceleration(0.9);

            // Phase 5: Collapse into Sudden Silence (22.5s)
            timeoutRef.current = setTimeout(() => {
              setPhase('COLLAPSE_SILENCE');
              setFinaleState({ phase: 'COLLAPSE_SILENCE', isCollapsing: true, machineSpeed: 0.05 });
              soundEngine.playFinaleCollapse();

              // Phase 6: Central Question 1 — Devastating Stillness (25.5s)
              timeoutRef.current = setTimeout(() => {
                setPhase('QUESTION_1');
                setFinaleState({ phase: 'QUESTION_1', isCollapsing: true });
                soundEngine.playDevastatingSilence();
                soundEngine.playSubtlePulse(82.4, 4.0, 0.18);

                // Phase 7: Central Question 2 — Violent Resurgence (30.5s)
                timeoutRef.current = setTimeout(() => {
                  setPhase('QUESTION_2');
                  setFinaleState({ phase: 'QUESTION_2' });
                  soundEngine.playDevastatingResurgence();

                  // Phase 8: Catastrophic Breakdown (36.0s)
                  timeoutRef.current = setTimeout(() => {
                    setPhase('BREAKDOWN');
                    setFinaleState({ phase: 'BREAKDOWN', isDestabilized: true, isCollapsing: false, machineSpeed: 4.5 });
                    soundEngine.playFinaleBreakdownTone();

                    // Phase 9: Pure Black Cut (42.0s)
                    timeoutRef.current = setTimeout(() => {
                      setPhase('PURE_BLACK');
                      setFinaleState({ phase: 'PURE_BLACK', isDestabilized: false, machineSpeed: 0 });
                      soundEngine.cutAudioImmediately();

                      // Seamless transition into Stage 07 after 5s pure black hold
                      timeoutRef.current = setTimeout(() => {
                        setStage(stages.ENDING);
                      }, 5000);
                    }, 6000);
                  }, 5500);
                }, 5000);
              }, 3000);
            }, 6000);
          }
        }, 850);
      }, 4000);
    }, 3500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      soundEngine.stopMachineRhythm();
    };
  }, [fragments, setFinaleState, setStage, stages.ENDING]);

  const activeFragment = fragments[activeFragmentIndex] || fragments[0];

  if (phase === 'PURE_BLACK') {
    return <div className="finale-pure-black" />;
  }

  return (
    <>
      <FinaleTypography phase={phase} currentFragment={activeFragment} />
      {phase === 'BREAKDOWN' && <FinaleBreakdown fragments={fragments} />}
    </>
  );
}
