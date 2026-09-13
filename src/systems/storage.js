/**
 * Session storage utility for The Human Condition.
 * Per Artistic Director Directive #15:
 * A browser refresh must ALWAYS begin a NEW JOURNEY at Stage 01 (OPENING)
 * with a fresh JourneyMemory. Stage state is NOT persisted across reloads.
 */

const STORAGE_KEY = 'THC_SESSION_STATE_V2';

export function loadStoredExperienceState() {
  // Always return null on fresh reload so the journey resets cleanly to OPENING
  return null;
}

export function saveStoredExperienceState(_state) {
  // Ephemeral in-memory state during the session. No persistent stage across reload.
}

export function clearStoredExperienceState() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[ExperienceState] Failed to clear storage:', error);
  }
}

