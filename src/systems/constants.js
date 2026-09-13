export const EXPERIENCE_STAGES = {
  OPENING: 'OPENING',
  TOUR_SELECTION: 'TOUR_SELECTION',
  LIBRARY: 'LIBRARY',
  MUSEUM: 'MUSEUM',
  BOOK: 'BOOK',
  FINALE: 'FINALE',
  ENDING: 'ENDING',
};

export const STAGE_ORDER = [
  EXPERIENCE_STAGES.OPENING,
  EXPERIENCE_STAGES.TOUR_SELECTION,
  EXPERIENCE_STAGES.LIBRARY,
  EXPERIENCE_STAGES.MUSEUM,
  EXPERIENCE_STAGES.BOOK,
  EXPERIENCE_STAGES.FINALE,
  EXPERIENCE_STAGES.ENDING,
];

export const TOUR_TYPES = {
  DETERMINISM: 'DETERMINISM',
  EXISTENTIALISM: 'EXISTENTIALISM',
  SOLIPSISM: 'SOLIPSISM',
  NIHILISM: 'NIHILISM',
};

export const INITIAL_EXPERIENCE_STATE = {
  currentStage: EXPERIENCE_STAGES.OPENING,
  previousStage: null,
  stageHistory: [EXPERIENCE_STAGES.OPENING],
  isTransitioning: false,
  transitionProgress: 0,

  // User Journey & Decisions
  selectedTour: null,
  focusedTourId: 'MUSEUM',
  activePhilosopherId: null,
  activeRoomId: null,
  inspectingBook: null,
  answers: {},
  visitedPhilosophers: [],
  visitedMuseumRooms: [],
  bookAnswers: {},
  bookThemes: [],
  bookContradictions: [],
  philosophicalLetter: null,
  bookWorldState: {
    isBookOpen: false,
    isTurningPage: false,
    pageTurnProgress: 0,
    cameraMode: 'APPROACHING',
  },
  finaleState: {
    phase: 'INTRO_1',
    machineSpeed: 0.5,
    fragmentCount: 0,
    isCollapsing: false,
    isDestabilized: false,
  },
  discoveredQuotes: [],
  discoveredBooks: [],
  journeyFragments: [],

  // Choice dissonance & psychological metrics
  metrics: {
    agencyScore: 50,
    rebellionCount: 0,
    hesitationTime: {},
    pathDeviations: 0,
  },

  // Audio / Ambience state
  audio: {
    muted: true,
    volume: 0.7,
    currentTrack: null,
  },
};
