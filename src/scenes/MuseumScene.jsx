import React, { useEffect, useCallback } from 'react';
import { useExperience } from '../hooks/useExperience';
import { MUSEUM_ROOMS_DATA } from '../data/museumRooms';
import { MuseumNavHUD } from './Museum/MuseumNavHUD';
import { soundEngine } from '../systems/audioEngine';
import '../styles/museum.css';

export function MuseumScene() {
  const {
    setStage,
    stages,
    activeRoomId,
    setActiveRoom,
    visitMuseumRoom,
  } = useExperience();

  const handleSelectRoom = useCallback((roomId) => {
    setActiveRoom(roomId);
    if (roomId) {
      visitMuseumRoom(roomId);
      const room = MUSEUM_ROOMS_DATA.find((r) => r.id === roomId);
      if (room) soundEngine.playMuseumRoomAcoustic(room);
    }
  }, [setActiveRoom, visitMuseumRoom]);

  const handleProceedToBook = useCallback(() => {
    soundEngine.playTransitionSwell();
    setStage(stages.BOOK);
  }, [setStage, stages.BOOK]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (activeRoomId && e.key === 'Escape') {
        handleSelectRoom(null);
        return;
      }

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= MUSEUM_ROOMS_DATA.length) {
        handleSelectRoom(MUSEUM_ROOMS_DATA[keyNum - 1].id);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRoomId, handleSelectRoom]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <MuseumNavHUD
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
        onProceedToBook={handleProceedToBook}
      />
    </div>
  );
}
