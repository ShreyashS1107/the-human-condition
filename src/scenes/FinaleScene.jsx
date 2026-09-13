import React from 'react';
import { FinaleSequence } from './Finale/FinaleSequence';
import '../styles/finale.css';

export function FinaleScene() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <FinaleSequence />
    </div>
  );
}
