import React, { useState } from 'react';
import { asset } from './utils';
import { ArrowLeft, User } from 'lucide-react';
import { CHARACTERS } from './data';
import './CharacterSelectionScreen.css';

export default function CharacterSelectionScreen({ onStartGame, onBack }) {
  const [victims, setVictims] = useState([]);
  const [bullys, setBullys] = useState([]);
  const [focusedCharId, setFocusedCharId] = useState(null);

  const handleStart = () => {
    const total = victims.length + bullys.length;
    if (total >= 1 && total <= 4) {
      let players = [];
      let playerId = 1;
      victims.forEach(charId => {
        players.push({ id: `p${playerId++}`, charId, role: 'victim' });
      });
      bullys.forEach(charId => {
        players.push({ id: `p${playerId++}`, charId, role: 'bully' });
      });
      onStartGame(players);
    }
  };

  const toggleFocus = (charId) => {
    setFocusedCharId(prev => prev === charId ? null : charId);
  };

  const handleSelectVictim = (e, charId) => {
    e.stopPropagation();
    if (victims.includes(charId)) {
      const newTotal = victims.length + bullys.length - 1;
      if (newTotal <= 3 && bullys.length > 1) {
         alert("No puedes quitar este personaje porque quedarían 2 agresores en una partida de 3 jugadores o menos.");
         return;
      }
      setVictims(prev => prev.filter(id => id !== charId));
    } else {
      const isBully = bullys.includes(charId);
      const total = victims.length + bullys.length + (isBully ? 0 : 1);
      
      if (total > 4) {
          alert("Máximo 4 jugadores en total.");
          return;
      }
      if (isBully) setBullys(prev => prev.filter(id => id !== charId));
      setVictims(prev => [...prev, charId]);
    }
    setFocusedCharId(null);
  };

  const handleSelectBully = (e, charId) => {
    e.stopPropagation();
    if (bullys.includes(charId)) {
      setBullys(prev => prev.filter(id => id !== charId));
    } else {
      const isVictim = victims.includes(charId);
      const newTotal = victims.length + bullys.length + (isVictim ? 0 : 1);
      const newBullysCount = bullys.length + 1;
      
      if (newTotal > 4) {
          alert("Máximo 4 jugadores en total.");
          return;
      }
      if (newTotal === 4 && newBullysCount > 2) {
          alert("Máximo 2 agresores en una partida de 4 jugadores.");
          return;
      }
      if (newTotal <= 3 && newBullysCount > 1) {
          alert("Máximo 1 agresor en partidas de 1 a 3 jugadores.");
          return;
      }

      if (isVictim) setVictims(prev => prev.filter(id => id !== charId));
      setBullys(prev => [...prev, charId]);
    }
    setFocusedCharId(null);
  };

  return (
    <div className="char-selection-container">
      <div style={{ position: 'absolute', top: '90px', right: '40px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <User size={24} color="#fff" />
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{victims.length + bullys.length} / 4</span>
      </div>

      <div className="selection-header">
        <h1 className="selection-title">Selecciona los Roles</h1>
        <p className="selection-subtitle">Elige quién vivirá la historia y quién será el agresor</p>
      </div>
      
      <div className="character-roster">
        {CHARACTERS.map(char => {
          const isVictim = victims.includes(char.id);
          const isBully = bullys.includes(char.id);
          const isFocused = focusedCharId === char.id;
          let extraClass = '';
          if (isVictim) extraClass = 'selected-victim';
          if (isBully) extraClass = 'selected-bully';
          if (isFocused) extraClass += ' focused';

          return (
            <div 
              key={char.id} 
              className={`character-wrapper ${extraClass}`}
              style={{ '--char-glow-color': char.color }}
              onClick={() => toggleFocus(char.id)}
            >
              <div className="character-visual">
                <img 
                  src={asset(`char_${char.id}.png`)} 
                  alt={char.name} 
                  className="character-img"
                  onError={(e) => { e.target.src = asset('kid_alone.png'); }}
                />
                {isVictim && <div className="role-badge badge-victim">VÍCTIMA</div>}
                {isBully && <div className="role-badge badge-bully">AGRESOR</div>}
              </div>
              <div className="character-info">
                <h2>{char.name}</h2>
                <span className="char-pronouns">{char.pronouns}</span>
                <p className="char-archetype">{char.archetype}</p>
                <p className="char-desc">{char.description}</p>
                
                <div className="selection-buttons">
                  <button 
                    className={`sel-btn victim-btn ${isVictim ? 'active' : ''}`}
                    onClick={(e) => handleSelectVictim(e, char.id)}
                    style={{ padding: '2px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img src={asset('VICTIMA.png')} alt="VÍCTIMA" style={{ height: '50px', objectFit: 'contain' }} />
                  </button>
                  <button 
                    className={`sel-btn bully-btn ${isBully ? 'active' : ''}`}
                    onClick={(e) => handleSelectBully(e, char.id)}
                    style={{ padding: '2px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img src={asset('BULLY.png')} alt="AGRESOR" style={{ height: '50px', objectFit: 'contain' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="start-game-btn"
        disabled={(victims.length + bullys.length) === 0}
        onClick={handleStart}
      >
        Comenzar Día
      </button>
    </div>
  );
}
