import React, { createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { EXPERIENCE_STAGES, STAGE_ORDER, INITIAL_EXPERIENCE_STATE } from './constants';
import { loadStoredExperienceState, saveStoredExperienceState, clearStoredExperienceState } from './storage';

const ExperienceContext = createContext(null);

const ACTION_TYPES = {
  SET_STAGE: 'SET_STAGE',
  NEXT_STAGE: 'NEXT_STAGE',
  PREV_STAGE: 'PREV_STAGE',
  SET_TRANSITION: 'SET_TRANSITION',
  SET_SELECTED_TOUR: 'SET_SELECTED_TOUR',
  SET_FOCUSED_TOUR: 'SET_FOCUSED_TOUR',
  SET_ACTIVE_PHILOSOPHER: 'SET_ACTIVE_PHILOSOPHER',
  SET_ACTIVE_ROOM: 'SET_ACTIVE_ROOM',
  SET_INSPECTING_BOOK: 'SET_INSPECTING_BOOK',
  RECORD_ANSWER: 'RECORD_ANSWER',
  VISIT_PHILOSOPHER: 'VISIT_PHILOSOPHER',
  VISIT_MUSEUM_ROOM: 'VISIT_MUSEUM_ROOM',
  RECORD_BOOK_ANSWER: 'RECORD_BOOK_ANSWER',
  SET_BOOK_ANALYSIS: 'SET_BOOK_ANALYSIS',
  SET_BOOK_WORLD_STATE: 'SET_BOOK_WORLD_STATE',
  SET_FINALE_STATE: 'SET_FINALE_STATE',
  DISCOVER_QUOTE: 'DISCOVER_QUOTE',
  DISCOVER_BOOK: 'DISCOVER_BOOK',
  ADD_JOURNEY_FRAGMENT: 'ADD_JOURNEY_FRAGMENT',
  UPDATE_METRICS: 'UPDATE_METRICS',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  SET_VOLUME: 'SET_VOLUME',
  RESET_EXPERIENCE: 'RESET_EXPERIENCE',
  HYDRATE_STATE: 'HYDRATE_STATE',
};

function experienceReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.HYDRATE_STATE:
      return {
        ...INITIAL_EXPERIENCE_STATE,
        ...action.payload,
        isTransitioning: false,
      };

    case ACTION_TYPES.SET_STAGE: {
      const nextStage = action.payload;
      if (nextStage === state.currentStage) return state;
      return {
        ...state,
        previousStage: state.currentStage,
        currentStage: nextStage,
        stageHistory: [...state.stageHistory, nextStage],
        isTransitioning: false,
      };
    }

    case ACTION_TYPES.NEXT_STAGE: {
      const currentIndex = STAGE_ORDER.indexOf(state.currentStage);
      if (currentIndex === -1 || currentIndex >= STAGE_ORDER.length - 1) return state;
      const nextStage = STAGE_ORDER[currentIndex + 1];
      return {
        ...state,
        previousStage: state.currentStage,
        currentStage: nextStage,
        stageHistory: [...state.stageHistory, nextStage],
        isTransitioning: false,
      };
    }

    case ACTION_TYPES.PREV_STAGE: {
      const currentIndex = STAGE_ORDER.indexOf(state.currentStage);
      if (currentIndex <= 0) return state;
      const prevStage = STAGE_ORDER[currentIndex - 1];
      return {
        ...state,
        previousStage: state.currentStage,
        currentStage: prevStage,
        stageHistory: [...state.stageHistory, prevStage],
        isTransitioning: false,
      };
    }

    case ACTION_TYPES.SET_TRANSITION:
      return {
        ...state,
        isTransitioning: action.payload.isTransitioning ?? state.isTransitioning,
        transitionProgress: action.payload.progress ?? state.transitionProgress,
      };

    case ACTION_TYPES.SET_SELECTED_TOUR:
      return {
        ...state,
        selectedTour: action.payload,
      };

    case ACTION_TYPES.SET_FOCUSED_TOUR:
      return {
        ...state,
        focusedTourId: action.payload,
      };

    case ACTION_TYPES.SET_ACTIVE_PHILOSOPHER:
      return {
        ...state,
        activePhilosopherId: action.payload,
      };

    case ACTION_TYPES.SET_ACTIVE_ROOM:
      return {
        ...state,
        activeRoomId: action.payload,
      };

    case ACTION_TYPES.SET_INSPECTING_BOOK:
      return {
        ...state,
        inspectingBook: action.payload,
      };

    case ACTION_TYPES.RECORD_ANSWER: {
      const { questionId, answer, weight = 0, tag = null } = action.payload;
      const updatedAnswers = {
        ...state.answers,
        [questionId]: {
          answer,
          tag,
          timestamp: Date.now(),
        },
      };

      // Adjust agency / determinism metric based on choice tag
      let agencyDelta = 0;
      if (tag === 'free_will') agencyDelta = 5;
      if (tag === 'determinism') agencyDelta = -5;

      return {
        ...state,
        answers: updatedAnswers,
        metrics: {
          ...state.metrics,
          agencyScore: Math.max(0, Math.min(100, state.metrics.agencyScore + agencyDelta + weight)),
        },
      };
    }

    case ACTION_TYPES.VISIT_PHILOSOPHER: {
      const philosopherId = action.payload;
      if (state.visitedPhilosophers.includes(philosopherId)) return state;
      return {
        ...state,
        visitedPhilosophers: [...state.visitedPhilosophers, philosopherId],
      };
    }

    case ACTION_TYPES.VISIT_MUSEUM_ROOM: {
      const roomId = action.payload;
      if (state.visitedMuseumRooms.includes(roomId)) return state;
      return {
        ...state,
        visitedMuseumRooms: [...state.visitedMuseumRooms, roomId],
      };
    }

    case ACTION_TYPES.RECORD_BOOK_ANSWER: {
      const { questionId, question, answer, timestamp = Date.now() } = action.payload;
      return {
        ...state,
        bookAnswers: {
          ...state.bookAnswers,
          [questionId]: {
            question,
            answer,
            timestamp,
          },
        },
      };
    }

    case ACTION_TYPES.SET_BOOK_ANALYSIS: {
      const { themes, contradictions, letter } = action.payload;
      return {
        ...state,
        bookThemes: themes || state.bookThemes,
        bookContradictions: contradictions || state.bookContradictions,
        philosophicalLetter: letter || state.philosophicalLetter,
      };
    }

    case ACTION_TYPES.SET_BOOK_WORLD_STATE: {
      return {
        ...state,
        bookWorldState: {
          ...state.bookWorldState,
          ...action.payload,
        },
      };
    }

    case ACTION_TYPES.SET_FINALE_STATE: {
      return {
        ...state,
        finaleState: {
          ...state.finaleState,
          ...action.payload,
        },
      };
    }

    case ACTION_TYPES.DISCOVER_QUOTE: {
      const quote = action.payload;
      const exists = state.discoveredQuotes.some((q) => q.id === quote.id);
      if (exists) return state;
      return {
        ...state,
        discoveredQuotes: [...state.discoveredQuotes, quote],
      };
    }

    case ACTION_TYPES.DISCOVER_BOOK: {
      const bookId = action.payload;
      if (state.discoveredBooks.includes(bookId)) return state;
      return {
        ...state,
        discoveredBooks: [...state.discoveredBooks, bookId],
      };
    }

    case ACTION_TYPES.ADD_JOURNEY_FRAGMENT: {
      const fragment = action.payload;
      return {
        ...state,
        journeyFragments: [...state.journeyFragments, { ...fragment, capturedAt: Date.now() }],
      };
    }

    case ACTION_TYPES.UPDATE_METRICS:
      return {
        ...state,
        metrics: {
          ...state.metrics,
          ...action.payload,
        },
      };

    case ACTION_TYPES.TOGGLE_AUDIO:
      return {
        ...state,
        audio: {
          ...state.audio,
          muted: !state.audio.muted,
        },
      };

    case ACTION_TYPES.SET_VOLUME:
      return {
        ...state,
        audio: {
          ...state.audio,
          volume: action.payload,
        },
      };

    case ACTION_TYPES.RESET_EXPERIENCE:
      clearStoredExperienceState();
      return {
        ...INITIAL_EXPERIENCE_STATE,
        stageHistory: [EXPERIENCE_STAGES.OPENING],
      };

    default:
      return state;
  }
}

export function ExperienceProvider({ children }) {
  const [state, dispatch] = useReducer(experienceReducer, INITIAL_EXPERIENCE_STATE);

  // Clear any legacy storage and ensure fresh journey boot
  useEffect(() => {
    clearStoredExperienceState();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Actions
  const setStage = useCallback((stage) => {
    dispatch({ type: ACTION_TYPES.SET_STAGE, payload: stage });
  }, []);

  const nextStage = useCallback(() => {
    dispatch({ type: ACTION_TYPES.NEXT_STAGE });
  }, []);

  const prevStage = useCallback(() => {
    dispatch({ type: ACTION_TYPES.PREV_STAGE });
  }, []);

  const setTransition = useCallback((isTransitioning, progress = 0) => {
    dispatch({ type: ACTION_TYPES.SET_TRANSITION, payload: { isTransitioning, progress } });
  }, []);

  const setSelectedTour = useCallback((tourId) => {
    dispatch({ type: ACTION_TYPES.SET_SELECTED_TOUR, payload: tourId });
  }, []);

  const setFocusedTour = useCallback((tourId) => {
    dispatch({ type: ACTION_TYPES.SET_FOCUSED_TOUR, payload: tourId });
  }, []);

  const setActivePhilosopher = useCallback((philosopherId) => {
    dispatch({ type: ACTION_TYPES.SET_ACTIVE_PHILOSOPHER, payload: philosopherId });
  }, []);

  const setActiveRoom = useCallback((roomId) => {
    dispatch({ type: ACTION_TYPES.SET_ACTIVE_ROOM, payload: roomId });
  }, []);

  const setInspectingBook = useCallback((book) => {
    dispatch({ type: ACTION_TYPES.SET_INSPECTING_BOOK, payload: book });
  }, []);

  const recordAnswer = useCallback((questionId, answer, weight = 0, tag = null) => {
    dispatch({
      type: ACTION_TYPES.RECORD_ANSWER,
      payload: { questionId, answer, weight, tag },
    });
  }, []);

  const visitPhilosopher = useCallback((philosopherId) => {
    dispatch({ type: ACTION_TYPES.VISIT_PHILOSOPHER, payload: philosopherId });
  }, []);

  const visitMuseumRoom = useCallback((roomId) => {
    dispatch({ type: ACTION_TYPES.VISIT_MUSEUM_ROOM, payload: roomId });
  }, []);

  const recordBookAnswer = useCallback((questionId, question, answer) => {
    dispatch({
      type: ACTION_TYPES.RECORD_BOOK_ANSWER,
      payload: { questionId, question, answer, timestamp: Date.now() },
    });
  }, []);

  const setBookAnalysis = useCallback(({ themes, contradictions, letter }) => {
    dispatch({
      type: ACTION_TYPES.SET_BOOK_ANALYSIS,
      payload: { themes, contradictions, letter },
    });
  }, []);

  const setBookWorldState = useCallback((partialState) => {
    dispatch({
      type: ACTION_TYPES.SET_BOOK_WORLD_STATE,
      payload: partialState,
    });
  }, []);

  const setFinaleState = useCallback((partialState) => {
    dispatch({
      type: ACTION_TYPES.SET_FINALE_STATE,
      payload: partialState,
    });
  }, []);

  const discoverQuote = useCallback((quote) => {
    dispatch({ type: ACTION_TYPES.DISCOVER_QUOTE, payload: quote });
  }, []);

  const discoverBook = useCallback((bookId) => {
    dispatch({ type: ACTION_TYPES.DISCOVER_BOOK, payload: bookId });
  }, []);

  const addJourneyFragment = useCallback((fragment) => {
    dispatch({ type: ACTION_TYPES.ADD_JOURNEY_FRAGMENT, payload: fragment });
  }, []);

  const updateMetrics = useCallback((partialMetrics) => {
    dispatch({ type: ACTION_TYPES.UPDATE_METRICS, payload: partialMetrics });
  }, []);

  const toggleAudio = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TOGGLE_AUDIO });
  }, []);

  const setVolume = useCallback((volume) => {
    dispatch({ type: ACTION_TYPES.SET_VOLUME, payload: volume });
  }, []);

  const resetExperience = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET_EXPERIENCE });
  }, []);

  // Choice influence evaluation engine (used to alter later scenes based on earlier decisions)
  const choiceInfluence = useMemo(() => {
    const totalAnswers = Object.keys(state.answers).length;
    const isDeterministLeaning = state.metrics.agencyScore < 45;
    const isExistentialistLeaning = state.metrics.agencyScore > 55;
    const hasSelectedTour = Boolean(state.selectedTour);

    return {
      totalAnswers,
      isDeterministLeaning,
      isExistentialistLeaning,
      hasSelectedTour,
      agencyScore: state.metrics.agencyScore,
      // Dissonance rating: the degree to which user actions contradict their stated philosophical path
      narrativeDissonance: Math.abs(50 - state.metrics.agencyScore),
      hasVisitedAllRooms: state.visitedMuseumRooms.length >= 3,
      hasVisitedAllPhilosophers: state.visitedPhilosophers.length >= 3,
    };
  }, [state.answers, state.metrics.agencyScore, state.selectedTour, state.visitedMuseumRooms, state.visitedPhilosophers]);

  const value = useMemo(
    () => ({
      ...state,
      stages: EXPERIENCE_STAGES,
      stageOrder: STAGE_ORDER,
      choiceInfluence,
      setStage,
      nextStage,
      prevStage,
      setTransition,
      setSelectedTour,
      setFocusedTour,
      setActivePhilosopher,
      setActiveRoom,
      setInspectingBook,
      recordAnswer,
      visitPhilosopher,
      visitMuseumRoom,
      recordBookAnswer,
      setBookAnalysis,
      setBookWorldState,
      setFinaleState,
      discoverQuote,
      discoverBook,
      addJourneyFragment,
      updateMetrics,
      toggleAudio,
      setVolume,
      resetExperience,
    }),
    [
      state,
      choiceInfluence,
      setStage,
      nextStage,
      prevStage,
      setTransition,
      setSelectedTour,
      setFocusedTour,
      setActivePhilosopher,
      setActiveRoom,
      setInspectingBook,
      recordAnswer,
      visitPhilosopher,
      visitMuseumRoom,
      recordBookAnswer,
      setBookAnalysis,
      setBookWorldState,
      setFinaleState,
      discoverQuote,
      discoverBook,
      addJourneyFragment,
      updateMetrics,
      toggleAudio,
      setVolume,
      resetExperience,
    ]
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
