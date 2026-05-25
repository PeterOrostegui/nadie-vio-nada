import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleGlobalMute, getIsMuted, startAmbientSound } from './audioSynth';

export default function MuteButton({ gamePhase }) {
  const [muted, setMuted] = useState(getIsMuted());

  const handleToggle = () => {
    const shouldAmbientPlay = (gamePhase === 'playing');
    const newState = toggleGlobalMute();
    
    // If we just unmuted, and we should be playing ambient sound, start it
    if (!newState && shouldAmbientPlay) {
      startAmbientSound();
    }
    
    setMuted(newState);
  };

  return (
    <button 
      onClick={handleToggle}
      className="floating-mute-btn"
      title={muted ? "Activar Sonido" : "Silenciar"}
    >
      {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  );
}
