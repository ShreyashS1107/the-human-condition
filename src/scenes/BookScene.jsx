import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useExperience } from '../hooks/useExperience';
import { BOOK_QUESTIONS } from '../data/bookQuestions';
import { BookAnswerInput } from './Book/BookAnswerInput';
import { BookLetterPages } from './Book/BookLetterPages';
import { generatePhilosophicalLetter } from '../systems/letter/generatePhilosophicalLetter';
import { soundEngine } from '../systems/audioEngine';
import { narrationEngine } from '../systems/voice/narrationEngine';
import '../styles/book.css';

const RITUAL_STAGES = {
  APPROACHING: 'APPROACHING',
  OPENING: 'OPENING',
  QUESTIONING: 'QUESTIONING',
  UNDERSTAND_MOMENT: 'UNDERSTAND_MOMENT',
  READING_LETTER: 'READING_LETTER',
  CLOSING_FINALE: 'CLOSING_FINALE',
};

export function BookScene() {
  const {
    setStage,
    stages,
    recordBookAnswer,
    setBookAnalysis,
    setBookWorldState,
  } = useExperience();

  const [ritualStage, setRitualStage] = useState(RITUAL_STAGES.APPROACHING);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showUnderstandText, setShowUnderstandText] = useState(false);
  const timeoutRef = useRef(null);

  // Step 1: Cinematic Approach into the chamber
  useEffect(() => {
    setBookWorldState({
      isBookOpen: false,
      isTurningPage: false,
      pageTurnProgress: 0,
      cameraMode: 'APPROACHING',
    });

    timeoutRef.current = setTimeout(() => {
      setRitualStage(RITUAL_STAGES.OPENING);
      soundEngine.playBookOpen();

      // Step 2: Book opens by itself
      setBookWorldState({
        isBookOpen: true,
        isTurningPage: false,
        pageTurnProgress: 0,
        cameraMode: 'READING',
      });

      timeoutRef.current = setTimeout(() => {
        setRitualStage(RITUAL_STAGES.QUESTIONING);
        soundEngine.playQuestionArrival();
      }, 1500);
    }, 2200);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [setBookWorldState]);

  // Answer Submission Handler
  const handleAnswerSubmit = useCallback(async (answerText) => {
    const currentQ = BOOK_QUESTIONS[questionIndex];
    if (!currentQ) return;

    const promptText = typeof currentQ.getPrompt === 'function'
      ? currentQ.getPrompt(answersMap)
      : currentQ.prompt;

    // Record locally and in global state
    const updatedAnswers = {
      ...answersMap,
      [currentQ.id]: answerText,
    };
    setAnswersMap(updatedAnswers);
    recordBookAnswer(currentQ.id, promptText, answerText);

    // Ink settling texture
    soundEngine.playInkSettling();

    // Page turning sequence with organic parchment friction
    setBookWorldState({ isTurningPage: true, pageTurnProgress: 0.1 });
    soundEngine.playPageTurn();

    const nextIndex = questionIndex + 1;

    setTimeout(() => {
      setBookWorldState({ isTurningPage: true, pageTurnProgress: 0.5 });
    }, 300);

    setTimeout(() => {
      setBookWorldState({ isTurningPage: true, pageTurnProgress: 0.9 });
    }, 600);

    setTimeout(async () => {
      setBookWorldState({ isTurningPage: false, pageTurnProgress: 0 });

      if (nextIndex < BOOK_QUESTIONS.length) {
        setQuestionIndex(nextIndex);
        soundEngine.playQuestionArrival();
      } else {
        // Step 4: All questions completed -> "I THINK I UNDERSTAND YOU" Sequence
        setRitualStage(RITUAL_STAGES.UNDERSTAND_MOMENT);
        setShowUnderstandText(false);

        // Book closes in total silence
        setBookWorldState({ isBookOpen: false, cameraMode: 'READING' });

        // Synthesize philosophical analysis
        const analysis = await generatePhilosophicalLetter(updatedAnswers);
        setAnalysisResult(analysis);
        setBookAnalysis({
          themes: analysis.themes,
          contradictions: analysis.contradictions,
          letter: analysis.letter,
        });

        // Reopen book with revelation text after respectful silence
        timeoutRef.current = setTimeout(() => {
          setBookWorldState({ isBookOpen: true, cameraMode: 'READING' });
          soundEngine.playBookOpen();
          soundEngine.playUnderstandBed();
          setShowUnderstandText(true);

          // Hold the moment, then advance to letter
          timeoutRef.current = setTimeout(() => {
            setRitualStage(RITUAL_STAGES.READING_LETTER);
            setBookWorldState({ isBookOpen: true, cameraMode: 'LETTER' });
          }, 3800);
        }, 2000);
      }
    }, 900);
  }, [questionIndex, answersMap, recordBookAnswer, setBookAnalysis, setBookWorldState]);

  // Finish Reading & Transition to Finale
  const handleFinishLetter = useCallback(() => {
    narrationEngine.stop();
    setRitualStage(RITUAL_STAGES.CLOSING_FINALE);
    soundEngine.playTransitionSwell();

    // Close book and retreat into darkness
    setBookWorldState({
      isBookOpen: false,
      isTurningPage: false,
      cameraMode: 'CLOSING',
    });

    timeoutRef.current = setTimeout(() => {
      setStage(stages.FINALE);
    }, 3500);
  }, [setBookWorldState, setStage, stages]);

  // Ensure speech synthesis is cancelled if unmounted
  useEffect(() => {
    return () => {
      narrationEngine.stop();
    };
  }, []);

  const currentQ = BOOK_QUESTIONS[questionIndex];
  const activePrompt = currentQ
    ? typeof currentQ.getPrompt === 'function'
      ? currentQ.getPrompt(answersMap)
      : currentQ.prompt
    : '';

  return (
    <div className="book-scene-root">
      {/* Header */}
      <header className="book-stage-header">
        <p className="book-stage-eyebrow">// STAGE 05 : THE BOOK THAT READS YOU</p>
      </header>

      {/* 1. Questioning Phase */}
      {ritualStage === RITUAL_STAGES.QUESTIONING && currentQ && (
        <BookAnswerInput
          questionPrompt={activePrompt}
          hint={currentQ.hint}
          placeholder={currentQ.placeholder}
          onSubmit={handleAnswerSubmit}
        />
      )}

      {/* 2. "I THINK I UNDERSTAND YOU." Revelation Phase */}
      {ritualStage === RITUAL_STAGES.UNDERSTAND_MOMENT && (
        <div className="book-page-container">
          {showUnderstandText && (
            <h1 className="understand-moment-text">
              I THINK I UNDERSTAND YOU.
            </h1>
          )}
        </div>
      )}

      {/* 3. Reading Philosophical Letter Manuscript */}
      {ritualStage === RITUAL_STAGES.READING_LETTER && analysisResult && (
        <BookLetterPages
          pages={analysisResult.pages}
          themes={analysisResult.themes}
          contradictions={analysisResult.contradictions}
          onFinishReading={handleFinishLetter}
        />
      )}

      {/* 4. Final Black Void Hold before Stage 06 */}
      {ritualStage === RITUAL_STAGES.CLOSING_FINALE && (
        <div className="book-dark-transition">
          <div className="font-mono" style={{ fontSize: '0.72rem', letterSpacing: '0.4em', color: 'rgba(217, 205, 180, 0.4)' }}>
            // THE CODEX HAS CLOSED //
          </div>
        </div>
      )}
    </div>
  );
}
