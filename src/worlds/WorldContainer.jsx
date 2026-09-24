import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useExperience } from '../hooks/useExperience';
import { TOURS_DATA } from '../data/tours';
import { TourPortal } from '../scenes/TourSelection/TourPortal';
import { LibraryWorld } from './LibraryWorld';
import { MuseumWorld } from './MuseumWorld';
import { BookWorld } from './BookWorld/BookWorld';
import { FinaleWorld } from './FinaleWorld/FinaleWorld';
import { VoidEnvironment } from './VoidEnvironment';
import { extractJourneyFragments } from '../systems/extractJourneyFragments';

function OpeningMonolith() {
  const meshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const coreRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.18;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.25;
      ring1Ref.current.rotation.x += delta * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.3;
      ring2Ref.current.rotation.z -= delta * 0.15;
    }
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.0) * 0.1;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={[0, 0, -1]}>
        {/* Outer Obsidian Monolith with Beveled Facets */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <octahedronGeometry args={[0.95, 0]} />
          <meshPhysicalMaterial
            color="#141416"
            roughness={0.15}
            metalness={0.85}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
            reflectivity={0.9}
          />
        </mesh>

        {/* Floating Antique Brass Gyro Ring 1 */}
        <group ref={ring1Ref}>
          <mesh>
            <torusGeometry args={[1.35, 0.022, 16, 64]} />
            <meshStandardMaterial
              color="#c49a45"
              metalness={0.92}
              roughness={0.28}
            />
          </mesh>
          {/* Axis Inlay Nodes */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh key={idx} position={[Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color="#e5b452" metalness={0.95} roughness={0.15} />
            </mesh>
          ))}
        </group>

        {/* Floating Antique Brass Gyro Ring 2 */}
        <group ref={ring2Ref} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
          <mesh>
            <torusGeometry args={[1.6, 0.018, 16, 64]} />
            <meshStandardMaterial
              color="#a67c33"
              metalness={0.9}
              roughness={0.35}
            />
          </mesh>
        </group>

        {/* Inner Luminous Resonance Core */}
        <mesh ref={coreRef} scale={[0.45, 0.45, 0.45]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#e5b452"
            emissive="#c49a45"
            emissiveIntensity={1.8}
            roughness={0.2}
          />
        </mesh>

        {/* Dynamic localized core radiance */}
        <pointLight position={[0, 0, 0]} intensity={1.8} distance={5} color="#e5b452" />
      </group>
    </Float>
  );
}

function TourSelectionWorld() {
  const { focusedTourId, setFocusedTour, selectedTour, setSelectedTour, recordAnswer, setStage, stages } = useExperience();
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const responsiveZDist = aspect < 1 ? Math.max(1.0, (1.0 / aspect) * 1.3) : 1.0;

    if (selectedTour) {
      const selected = TOURS_DATA.find((t) => t.id === selectedTour);
      if (selected) {
        // Leaving the gallery and entering the chosen artwork
        targetCamPos.current.set(selected.position[0], 0.35, selected.position[2] + 4.2 * responsiveZDist);
        targetLookAt.current.set(selected.position[0], 0.25, selected.position[2]);
      }
    } else {
      const focusedTour = TOURS_DATA.find((t) => t.id === focusedTourId) || TOURS_DATA[1];

      if (focusedTour) {
        // Smooth cinematic camera shift toward the focused destination
        const offsetX = focusedTour.position[0] * 0.38;
        targetCamPos.current.set(offsetX, 0.3, 6.2 * responsiveZDist);
        targetLookAt.current.set(focusedTour.position[0] * 0.55, 0.2, focusedTour.position[2] * 0.4);
      } else {
        targetCamPos.current.set(0, 0, 7.5 * responsiveZDist);
        targetLookAt.current.set(0, 0, 0);
      }
    }

    camera.position.lerp(targetCamPos.current, delta * 2.2);
    currentLookAt.current.lerp(targetLookAt.current, delta * 2.5);
    camera.lookAt(currentLookAt.current);
  });

  const handleSelect = (tourId) => {
    const tour = TOURS_DATA.find((t) => t.id === tourId);
    if (!tour) return;
    setSelectedTour(tour.id);
    recordAnswer('tour_chosen_spatial', tour.id, 0, tour.id === 'LIBRARY' ? 'determinism' : tour.id === 'BOOK' ? 'determinism' : 'free_will');
    setStage(stages[tour.stageTarget] || stages.LIBRARY);
  };

  return (
    <group>
      {/* 3 Distant Physical Portals - When one is selected, the others are unmounted/hidden */}
      {TOURS_DATA.map((tour) => {
        if (selectedTour && selectedTour !== tour.id) return null;

        return (
          <TourPortal
            key={tour.id}
            tour={tour}
            isFocused={focusedTourId === tour.id}
            onFocus={(id) => setFocusedTour(id)}
            onSelect={handleSelect}
          />
        );
      })}

      {/* Atmospheric Void Lighting with Soft Directional Key Shadows */}
      <ambientLight intensity={selectedTour ? 0.1 : 0.2} color="#181a20" />
      <directionalLight
        position={[0, 9, 5]}
        intensity={selectedTour ? 0.7 : 1.1}
        color="#f7ecd7"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <pointLight position={[0, -2, 2]} intensity={0.3} color="#3a4556" />
    </group>
  );
}

export function WorldContainer() {
  const {
    currentStage,
    stages,
    activePhilosopherId,
    setActivePhilosopher,
    setInspectingBook,
    activeRoomId,
    setActiveRoom,
    bookWorldState,
    finaleState,
    bookAnswers,
    answers,
    visitedPhilosophers,
    visitedMuseumRooms,
    discoveredBooks,
    bookContradictions,
    bookThemes,
    selectedTour,
  } = useExperience();

  const finaleFragments = React.useMemo(() => {
    if (currentStage !== stages.FINALE) return [];
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
  }, [
    currentStage,
    stages.FINALE,
    bookAnswers,
    answers,
    visitedPhilosophers,
    visitedMuseumRooms,
    discoveredBooks,
    bookContradictions,
    bookThemes,
    selectedTour,
  ]);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#020305', 8.0, 105.0]} />
      
      {/* 3-Layer Spatial Void Depth Architecture */}
      <VoidEnvironment />

      {currentStage === stages.OPENING && (
        <>
          <ambientLight intensity={0.15} />
          <pointLight position={[0, 2, 2]} intensity={0.8} color="#c49a45" />
          <OpeningMonolith />
        </>
      )}

      {currentStage === stages.TOUR_SELECTION && <TourSelectionWorld />}

      {currentStage === stages.LIBRARY && (
        <LibraryWorld
          activePhilosopherId={activePhilosopherId}
          onSelectPhilosopher={(id) => setActivePhilosopher(id)}
          onInspectBook={(book) => setInspectingBook(book)}
        />
      )}

      {currentStage === stages.MUSEUM && (
        <MuseumWorld
          activeRoomId={activeRoomId}
          onSelectRoom={(id) => setActiveRoom(id)}
        />
      )}

      {currentStage === stages.BOOK && (
        <BookWorld
          isOpen={bookWorldState?.isBookOpen ?? false}
          isTurningPage={bookWorldState?.isTurningPage ?? false}
          pageTurnProgress={bookWorldState?.pageTurnProgress ?? 0}
          cameraMode={bookWorldState?.cameraMode ?? 'APPROACHING'}
        />
      )}

      {currentStage === stages.FINALE && (
        <FinaleWorld
          phase={finaleState?.phase ?? 'INTRO_1'}
          machineSpeed={finaleState?.machineSpeed ?? 1.0}
          activeFragmentCount={finaleState?.fragmentCount ?? 0}
          isCollapsing={finaleState?.isCollapsing ?? false}
          isDestabilized={finaleState?.isDestabilized ?? false}
          fragments={finaleFragments}
        />
      )}
    </>
  );
}
