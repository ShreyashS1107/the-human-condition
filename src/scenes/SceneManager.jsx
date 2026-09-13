import React from 'react';
import { useExperience } from '../hooks/useExperience';
import { OpeningScene } from './OpeningScene';
import { TourSelectionScene } from './TourSelectionScene';
import { LibraryScene } from './LibraryScene';
import { MuseumScene } from './MuseumScene';
import { BookScene } from './BookScene';
import { FinaleScene } from './FinaleScene';
import { EndingScene } from './EndingScene';

export function SceneManager() {
  const { currentStage, stages } = useExperience();

  switch (currentStage) {
    case stages.OPENING:
      return <OpeningScene />;
    case stages.TOUR_SELECTION:
      return <TourSelectionScene />;
    case stages.LIBRARY:
      return <LibraryScene />;
    case stages.MUSEUM:
      return <MuseumScene />;
    case stages.BOOK:
      return <BookScene />;
    case stages.FINALE:
      return <FinaleScene />;
    case stages.ENDING:
      return <EndingScene />;
    default:
      return <OpeningScene />;
  }
}
