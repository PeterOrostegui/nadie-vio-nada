import React, { useState, useEffect } from 'react';
import { asset } from './utils';
import { playDiceSound, playMoveSound, toggleGlobalMute, startAmbientSound, stopAmbientSound } from './audioSynth';
import { BOARD_CELLS, EVENT_CARDS, CONSEQUENCE_CARDS, CHARACTERS, CELL_COORDS } from './data';
import './App.css';
import './Responsive.css';
import { Volume2, VolumeX, Users, Dice5, AlertTriangle, User, ArrowLeft, Home } from 'lucide-react';
import Board3D from './Board3D';
import LandingScreen from './LandingScreen';
import CharacterSelectionScreen from './CharacterSelectionScreen';
import Navbar from './Navbar';
import FlipCardModalWrapper from './FlipCardModalWrapper';
import MuteButton from './MuteButton';

let eventDeck = [];
const drawEventCard = () => {
    if (eventDeck.length === 0) {
        eventDeck = [...EVENT_CARDS].sort(() => Math.random() - 0.5);
    }
    return eventDeck.pop();
};

let consequenceDeck = [];
const drawConsequenceCard = () => {
    if (consequenceDeck.length === 0) {
        consequenceDeck = [...CONSEQUENCE_CARDS].sort(() => Math.random() - 0.5);
    }
    return consequenceDeck.pop();
};

const renderTextWithIcons = (text) => {
  if (!text) return text;
  const parts = text.split(/(⭐|🤝|⚡|❤️)/g);
  return parts.map((part, index) => {
    if (part === '⭐') return <img key={index} src={asset('Valentía.png')} alt="Valentía" style={{ width: '16px', height: '16px', verticalAlign: 'middle', margin: '0 2px', display: 'inline' }} />;
    if (part === '🤝') return <img key={index} src={asset('Aliado.png')} alt="Aliado" style={{ width: '16px', height: '16px', verticalAlign: 'middle', margin: '0 2px', display: 'inline' }} />;
    if (part === '⚡') return <img key={index} src={asset('Poder.png')} alt="Poder" style={{ width: '16px', height: '16px', verticalAlign: 'middle', margin: '0 2px', display: 'inline' }} />;
    if (part === '❤️') return <img key={index} src={asset('Empatía.png')} alt="Empatía" style={{ width: '16px', height: '16px', verticalAlign: 'middle', margin: '0 2px', display: 'inline' }} />;
    return part;
  });
};

function App() {
  const loadState = (key, defaultVal) => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [gamePhase, setGamePhase] = useState(() => loadState('gamePhase', 'landing'));
  const [players, setPlayers] = useState(() => loadState('players', []));
  const [activePlayerIndex, setActivePlayerIndex] = useState(() => loadState('activePlayerIndex', 0));
  
  const [diceResult, setDiceResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [diceMessage, setDiceMessage] = useState(null);
  const [isDiceFading, setIsDiceFading] = useState(false);
  const [activeModal, setActiveModal] = useState(() => loadState('activeModal', null)); 
  const [targetPowerModal, setTargetPowerModal] = useState(null);
  const [infoModal, setInfoModal] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('gamePhase', JSON.stringify(gamePhase));
    sessionStorage.setItem('players', JSON.stringify(players));
    sessionStorage.setItem('activePlayerIndex', JSON.stringify(activePlayerIndex));
    sessionStorage.setItem('activeModal', JSON.stringify(activeModal));
  }, [gamePhase, players, activePlayerIndex, activeModal]);

  // Auto-start ambient sound when game phase is 'playing'
  useEffect(() => {
    if (gamePhase === 'playing') {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
  }, [gamePhase]);

  const activePlayer = players[activePlayerIndex];

  const handleReturnToHome = () => {
    stopAmbientSound();
    setGamePhase('landing');
    setActiveModal(null);
    setPlayers([]);
    setActivePlayerIndex(0);
    setDiceResult(null);
  };

  const advanceTurn = (newPlayersState = null) => {
     const currentPlayers = newPlayersState || players;
     let nextIdx = (activePlayerIndex + 1) % currentPlayers.length;
     let loops = 0;
     while(currentPlayers[nextIdx].finished && loops < currentPlayers.length) {
         nextIdx = (nextIdx + 1) % currentPlayers.length;
         loops++;
     }
     if (loops >= currentPlayers.length) {
         setActiveModal({ type: 'game_over_all' });
         return;
     }
     const nextPlayers = currentPlayers.map((p, i) => i === nextIdx ? { ...p, powerUsedThisTurn: false } : p);
     setPlayers(nextPlayers);
     setActivePlayerIndex(nextIdx);
     setDiceResult(null);
  };

  const rollDice = () => {
    if (isRolling || isMoving || activeModal !== null || targetPowerModal !== null || !activePlayer) return;
    
    if (activePlayer.role === 'bully' && activePlayer.skipNextTurn) {
        setPlayers(prev => prev.map((p, i) => i === activePlayerIndex ? { ...p, skipNextTurn: false } : p));
        setActiveModal({ type: 'skipped_turn' });
        return;
    }

    setIsRolling(true);
    // eslint-disable-next-line react-hooks/purity
    const result = Math.floor(Math.random() * 6) + 1;
    setDiceResult(result);

    // Audio de dados
    playDiceSound();

    setTimeout(() => {
      setIsRolling(false); 
      const moves = result <= 2 ? 1 : result <= 4 ? 2 : 3;
      setDiceMessage(`¡Sacaste ${result}! Avanzas ${moves} casilla${moves > 1 ? 's' : ''}.`);
      
      setTimeout(() => {
         setDiceMessage(null);
         setIsDiceFading(true);
         
         setTimeout(() => {
            setDiceResult(null);
            setIsDiceFading(false);
            movePlayer(moves);
         }, 150); // 150ms para desaparecer velozmente
      }, 2500); // 2.5s mostrando el mensaje
    }, 2000); // Termina la tirada
  };



  const movePlayer = (moves, currentPlayersArray = players) => {
    setIsMoving(true);
    const activeP = currentPlayersArray[activePlayerIndex];
    const startPos = activeP.pos;
    let endPos = Math.min(20, startPos + moves);
    
    for (let i = startPos + 1; i <= endPos; i++) {
        const cellInfo = BOARD_CELLS.find(c => c.id === i);
        if (cellInfo && cellInfo.type === 'decision') {
            endPos = i; 
            break;
        }
    }

    const actualMoves = endPos - startPos;
    const remainingMoves = moves - actualMoves;
    
    if (actualMoves === 0) {
      handleCellLanding(startPos, activeP.role, remainingMoves);
      return;
    }

    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
      currentStep++;
      const nextPos = startPos + currentStep;
      
      setPlayers(prev => prev.map((p, i) => i === activePlayerIndex ? { ...p, pos: nextPos } : p));
      playMoveSound();
      
      if (currentStep >= actualMoves) {
        clearInterval(stepInterval);
        
        setTimeout(() => {
          handleCellLanding(endPos, activeP.role, remainingMoves);
        }, 1500); 
      }
    }, 800); 
  };

  const handleCellLanding = (pos, role, remainingMoves = 0) => {
    setIsMoving(false);
    if (pos === 20) {
      if (role === 'victim' && activePlayer.stats.valentia >= 5) {
        setActiveModal({ type: 'victory', winner: 'victim' });
      } else if (role === 'bully' && activePlayer.stats.empatia >= 5) {
        setActiveModal({ type: 'victory', winner: 'bully' });
      } else {
        if (activePlayer.secondChanceUsed) {
           setActiveModal({ type: 'neutral_ending', role });
        } else {
           setActiveModal({ type: 'repetition' });
        }
      }
      return;
    }

    const cell = BOARD_CELLS.find(c => c.id === pos);
    if (!cell) {
        if (remainingMoves > 0) movePlayer(remainingMoves);
        else advanceTurn();
        return;
    }
    
    if (role === 'victim' && activePlayer.skipNextInteraction && (cell.type === 'interaccion' || cell.type === 'decision')) {
       setPlayers(prev => prev.map((p, i) => i === activePlayerIndex ? { ...p, skipNextInteraction: false } : p));
       setActiveModal({ type: 'blocked_interaction', cell, remainingMoves });
       return;
    }

    if (cell.type === 'interaccion') {
      const randomEvent = drawEventCard();
      setActiveModal({ cell, eventCard: randomEvent, remainingMoves });
    } else {
      setActiveModal({ cell, remainingMoves });
    }
  };

  const closeModalAndSwitchTurn = (newPlayersState = null) => {
    let nextPlayers = Array.isArray(newPlayersState) ? newPlayersState : players;
    const remaining = activeModal?.remainingMoves || 0;
    
    if (activeModal?.type === 'repetition') {
       nextPlayers = nextPlayers.map((p, i) => i === activePlayerIndex ? { ...p, pos: 11, secondChanceUsed: true } : p);
       setPlayers(nextPlayers);
       setActiveModal(null);
       advanceTurn(nextPlayers);
       return;
    }

    if (activeModal?.type === 'neutral_ending' || activeModal?.type === 'victory') {
       nextPlayers = nextPlayers.map((p, i) => i === activePlayerIndex ? { ...p, finished: true } : p);
       setPlayers(nextPlayers);
       setActiveModal(null);
       advanceTurn(nextPlayers);
       return;
    }

    if (remaining > 0) {
       setPlayers(nextPlayers);
       setActiveModal(null);
       setTimeout(() => movePlayer(remaining, nextPlayers), 500);
       return;
    }

    setActiveModal(null);
    advanceTurn(nextPlayers);
  };

  const handleEventCard = (card, role) => {
    const effectText = role === 'victim' ? card.victimEffect : card.bullyEffect;
    
    let consequenceToDraw = 0;
    let extraMoves = 0;
    let skipNext = false;
    
    if (effectText.includes('Roba 1 Consecuencia')) consequenceToDraw = 1;
    if (effectText.includes('Roba 2 Consecuencias')) consequenceToDraw = 2;
    if (effectText.includes('Avanza 1 casilla extra')) extraMoves = 1;
    if (effectText.includes('Pierde su próximo turno')) skipNext = true;

    const nextPlayers = players.map((p, i) => {
      if (i !== activePlayerIndex) return p;
      let newStats = { ...p.stats };
      let newSkipTurn = skipNext || p.skipNextTurn;
      
      const valentiaMatch = effectText.match(/([+\-\u2212])\s*(\d+)\s*Valent[ií]a/i);
      if (valentiaMatch) {
          const sign = valentiaMatch[1] === '+' ? 1 : -1;
          newStats.valentia = Math.max(0, newStats.valentia + sign * parseInt(valentiaMatch[2], 10));
      }
      
      const aliadosMatch = effectText.match(/([+\-\u2212])?\s*(\d+)\s*Aliado/i);
      if (aliadosMatch) {
          const sign = (aliadosMatch[1] === '-' || aliadosMatch[1] === '\u2212') ? -1 : 1;
          newStats.aliados = Math.max(0, newStats.aliados + sign * parseInt(aliadosMatch[2], 10));
      }

      const empatiaMatch = effectText.match(/([+\-\u2212])\s*(\d+)\s*Empat[ií]a/i);
      if (empatiaMatch) {
          const sign = empatiaMatch[1] === '+' ? 1 : -1;
          newStats.empatia = Math.max(0, newStats.empatia + sign * parseInt(empatiaMatch[2], 10));
      }
      
      const poderMatch = effectText.match(/([+\-\u2212])\s*(\d+)\s*Poder/i);
      const pierdePoderMatch = effectText.match(/pierde\s*(\d+)\s*Poder/i);
      if (poderMatch) {
          const sign = poderMatch[1] === '+' ? 1 : -1;
          newStats.poder = Math.max(0, newStats.poder + sign * parseInt(poderMatch[2], 10));
      } else if (pierdePoderMatch) {
          newStats.poder = Math.max(0, newStats.poder - parseInt(pierdePoderMatch[1], 10));
      }
      let consequenceToDraw = 0;
      let penaltyReason = null;
      if (role === 'bully') {
          if (effectText.includes('Roba 1 Consecuencia')) {
              consequenceToDraw += 1;
              newStats.consecuencias += 1;
          }
          if (newStats.poder >= 5 && p.stats.poder < 5) {
              consequenceToDraw += 1;
              newStats.consecuencias += 1;
              penaltyReason = 'accumulate';
          }
      }
      return { ...p, stats: newStats, skipNextTurn: newSkipTurn, _consequenceToDraw: consequenceToDraw, _penaltyReason: penaltyReason };
    });

    const activeP_next = nextPlayers[activePlayerIndex];
    if (activeP_next._consequenceToDraw > 0) {
       setPlayers(nextPlayers);
       const randomCard = drawConsequenceCard();
       setActiveModal({ type: 'consecuencia', card: randomCard, count: activeP_next._consequenceToDraw, remainingMoves: activeModal?.remainingMoves, isPowerPenalty: activeP_next._penaltyReason !== null, powerPenaltyReason: activeP_next._penaltyReason });
       return; 
    }


    if (extraMoves > 0) {
       setPlayers(nextPlayers);
       setActiveModal(null);
       const totalMoves = extraMoves + (activeModal?.remainingMoves || 0);
       setTimeout(() => movePlayer(totalMoves, nextPlayers), 600); 
       return;
    }

    closeModalAndSwitchTurn(nextPlayers);
  };

  const handleDecision = (opt, role) => {
    let consequenceToDraw = 0;
    const effectStr = opt.effect || '';
    let penaltyReason = null;

    if (role === 'bully') {
        let predictedPoder = activePlayer.stats.poder;
        const poderMatch = effectStr.match(/([+\-\u2212])\s*(\d+)\s*Poder/i);
        const pierdePoderMatch = effectStr.match(/pierde\s*(\d+)\s*Poder/i);
        
        if (poderMatch) {
            const sign = poderMatch[1] === '+' ? 1 : -1;
            predictedPoder += sign * parseInt(poderMatch[2], 10);
        } else if (pierdePoderMatch) {
            predictedPoder -= parseInt(pierdePoderMatch[1], 10);
        }
        
        if (predictedPoder >= 5 && activePlayer.stats.poder < 5) {
            consequenceToDraw += 1; 
            penaltyReason = 'accumulate';
        }
    }
    
    const nextPlayers = players.map((p, i) => {
      if (i !== activePlayerIndex) return p;
      let newStats = { ...p.stats };
      
      if (role === 'victim') {
        const valentiaMatch = effectStr.match(/([+\-\u2212])\s*(\d+)\s*Valent[ií]a/i);
        if (valentiaMatch) {
            const sign = valentiaMatch[1] === '+' ? 1 : -1;
            newStats.valentia = Math.max(0, newStats.valentia + sign * parseInt(valentiaMatch[2], 10));
        }
        
        const aliadosMatch = effectStr.match(/([+\-\u2212])?\s*(\d+)\s*Aliado/i);
        if (aliadosMatch) {
            const sign = (aliadosMatch[1] === '-' || aliadosMatch[1] === '\u2212') ? -1 : 1;
            newStats.aliados = Math.max(0, newStats.aliados + sign * parseInt(aliadosMatch[2], 10));
        }
      } else {
        const empatiaMatch = effectStr.match(/([+\-\u2212])\s*(\d+)\s*Empat[ií]a/i);
        if (empatiaMatch) {
            const sign = empatiaMatch[1] === '+' ? 1 : -1;
            newStats.empatia = Math.max(0, newStats.empatia + sign * parseInt(empatiaMatch[2], 10));
        }
        
        const poderMatch = effectStr.match(/([+\-\u2212])\s*(\d+)\s*Poder/i);
        const pierdePoderMatch = effectStr.match(/pierde\s*(\d+)\s*Poder/i);
        if (poderMatch) {
            const sign = poderMatch[1] === '+' ? 1 : -1;
            newStats.poder = Math.max(0, newStats.poder + sign * parseInt(poderMatch[2], 10));
        } else if (pierdePoderMatch) {
            newStats.poder = Math.max(0, newStats.poder - parseInt(pierdePoderMatch[1], 10));
        }
        
        newStats.consecuencias += consequenceToDraw;
      }
      return { ...p, stats: newStats };
    });

    if (consequenceToDraw > 0) {
       setPlayers(nextPlayers);
       const randomCard = drawConsequenceCard();
       setActiveModal({ type: 'consecuencia', card: randomCard, count: consequenceToDraw, remainingMoves: activeModal?.remainingMoves, isPowerPenalty: penaltyReason !== null, powerPenaltyReason: penaltyReason });
       return; 
    }

    closeModalAndSwitchTurn(nextPlayers);
  };

  const applyConsequenceAndClose = (card) => {
      const nextPlayers = players.map((p, i) => {
         if (i !== activePlayerIndex) return p;
         let newStats = { ...p.stats };
         let newPos = p.pos;
         let newSkip = p.skipNextTurn;
         
         const effectText = card.effect || '';
         const pierdePoderMatch = effectText.match(/pierde\s*(\d+)\s*Poder/i);
         if (pierdePoderMatch) {
             newStats.poder = Math.max(0, newStats.poder - parseInt(pierdePoderMatch[1], 10));
         }
         
         const retrocedeMatch = effectText.match(/retrocede\s*(\d+)\s*casilla/i);
         if (retrocedeMatch) {
             newPos = Math.max(1, newPos - parseInt(retrocedeMatch[1], 10));
         }

         if (effectText.toLowerCase().includes('pierde próximo turno')) newSkip = true;

         return { ...p, stats: newStats, pos: newPos, skipNextTurn: newSkip };
      });
      closeModalAndSwitchTurn(nextPlayers);
  };

  const handleUsePowerClick = (cost) => {
     const availableVictims = players.filter(p => p.role === 'victim' && !p.finished);
     if (availableVictims.length === 0) {
         alert("No hay víctimas disponibles.");
         return;
     }
     if (availableVictims.length === 1) {
         executeBullyPower(cost, availableVictims[0].id);
     } else {
         setTargetPowerModal({ cost, targets: availableVictims });
     }
  };

  const executeBullyPower = (cost, targetId) => {
      let triggeredConsequences = 0;
      let newGastado = (activePlayer.stats.poderGastado || 0) + cost;
      triggeredConsequences = Math.floor(newGastado / 3) - Math.floor((activePlayer.stats.poderGastado || 0) / 3);

      setPlayers(prev => prev.map(p => {
          if (p.id === activePlayer.id) {
             return { ...p, powerUsedThisTurn: true, stats: { ...p.stats, poder: p.stats.poder - cost, consecuencias: p.stats.consecuencias + triggeredConsequences, poderGastado: newGastado }};
          }
          if (p.id === targetId) {
             if (cost === 1) return { ...p, pos: Math.max(1, p.pos - 1) };
             if (cost === 2) return { ...p, skipNextInteraction: true };
             if (cost === 3) return { ...p, stats: { ...p.stats, valentia: Math.max(0, p.stats.valentia - 1) }};
          }
          return p;
      }));
      setTargetPowerModal(null);
      
      if (triggeredConsequences > 0) {
          const randomCard = drawConsequenceCard();
          setActiveModal({ type: 'consecuencia', card: randomCard, count: triggeredConsequences, isPowerPenalty: true, powerPenaltyReason: 'spend' });
      }
  };

  const renderModalContent = () => {
    if (!activeModal) return null;

    if (activeModal.type === 'game_over_all') {
        const sortedPlayers = [...players].sort((a, b) => {
            const aWon = a.role === 'victim' ? (a.stats.valentia + a.stats.aliados >= 5) : (a.stats.empatia >= 5);
            const bWon = b.role === 'victim' ? (b.stats.valentia + b.stats.aliados >= 5) : (b.stats.empatia >= 5);
            if (aWon && !bWon) return -1;
            if (!aWon && bWon) return 1;
            const aPoints = a.role === 'victim' ? (a.stats.valentia + a.stats.aliados) : a.stats.empatia;
            const bPoints = b.role === 'victim' ? (b.stats.valentia + b.stats.aliados) : b.stats.empatia;
            return bPoints - aPoints;
        });

        return (
          <div className="modal-content" style={{ maxWidth: '600px', textAlign: 'center', padding: '20px' }}>
            <h2 className="modal-title" style={{fontSize: '2rem', color: '#10b981', marginBottom: '10px'}}>¡PARTIDA FINALIZADA!</h2>
            <p className="modal-body" style={{ fontSize: '1rem', marginBottom: '10px' }}>Todos los jugadores han llegado a la meta o concluido su participación.</p>
            
            <div style={{ margin: '10px 0', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px' }}>
              <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.1rem' }}>🏆 Resultados Finales</h3>
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                {sortedPlayers.map((p, i) => {
                   const isVictim = p.role === 'victim';
                   const points = isVictim ? (p.stats.valentia + p.stats.aliados) : p.stats.empatia;
                   const won = points >= 5;
                   const charData = CHARACTERS.find(c => c.id === p.charId);
                   return (
                     <div key={p.id} style={{ display: 'flex', alignItems: 'center', padding: '5px 10px', borderBottom: i < sortedPlayers.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                       <div style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', color: i === 0 ? '#fbbf24' : '#94a3b8' }}>#{i+1}</div>
                       <img src={asset(`char_${p.charId}.png`)} alt={charData?.name} style={{ width: '30px', height: '30px', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%', border: `2px solid ${isVictim ? '#3b82f6' : '#ef4444'}`, margin: '0 10px' }} />
                       <div style={{ lineHeight: '1.2' }}>
                         <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: isVictim ? '#3b82f6' : '#ef4444' }}>{charData?.name} ({isVictim ? 'Víctima' : 'Agresor'})</div>
                         <div style={{ fontSize: '0.8rem', color: won ? '#10b981' : '#94a3b8' }}>
                           {won ? 'Victoria' : 'Desenlace Neutro'} — {points} pts
                         </div>
                       </div>
                     </div>
                   );
                })}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', margin: '10px 0', textAlign: 'center' }}>
              <h3 style={{ color: '#FBBF24', marginBottom: '5px', fontSize: '1rem' }}>Créditos del Proyecto</h3>
              <p style={{ margin: '3px 0', fontSize: '0.8rem' }}><strong>Diseño de Interacción</strong> — 7mo Semestre, 2026</p>
              <p style={{ margin: '3px 0', fontSize: '0.75rem', color: '#94a3b8' }}>Proyecto Académico Universitario</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', fontStyle: 'italic', lineHeight: '1.2' }}>
                "Nadie Vio Nada" busca generar empatía y conciencia sobre el impacto de nuestras acciones en el entorno escolar.
              </p>
            </div>

            <button className="option-btn" style={{ fontSize: '1rem', padding: '10px 20px', width: '100%', background: 'var(--color-sec-verde)', color: 'white', border: 'none', textAlign: 'center', marginTop: '10px' }} onClick={handleReturnToHome}>
              VOLVER AL INICIO
            </button>
          </div>
        );
    }

    if (activeModal.type === 'skipped_turn') {
        return (
          <div className="modal-content" style={{ border: '3px solid #ef4444', textAlign: 'center' }}>
            <h2 className="modal-title" style={{ color: '#ef4444', textAlign: 'center', fontSize: '1.6rem', textTransform: 'uppercase' }}>TURNO PERDIDO</h2>
            <p className="modal-body" style={{ textAlign: 'center' }}>Pierdes este turno debido a una Consecuencia.</p>
            <button className="close-btn" style={{ background: '#ef4444', margin: '20px auto 0', display: 'block', float: 'none' }} onClick={closeModalAndSwitchTurn}>Continuar</button>
          </div>
        );
    }
    
    if (activeModal.type === 'blocked_interaction') {
        return (
          <div className="modal-content" style={{ border: '3px solid #26539D', textAlign: 'center' }}>
            <h2 className="modal-title" style={{ color: '#26539D', textAlign: 'center', fontSize: '1.6rem', textTransform: 'uppercase' }}>CASILLA BLOQUEADA</h2>
            <p className="modal-body" style={{ textAlign: 'center' }}>El Agresor usó su poder de Bloqueo sobre ti. No puedes realizar la interacción ni tomar la decisión de esta casilla.</p>
            <button className="close-btn" style={{ background: '#26539D', margin: '20px auto 0', display: 'block', float: 'none' }} onClick={closeModalAndSwitchTurn}>Continuar</button>
          </div>
        );
    }

    if (activeModal.type === 'victory') {
        const isVictim = activeModal.winner === 'victim';
        const reflection = isVictim 
          ? "A pesar de todo, lograste alzar la voz y rodearte de personas que te apoyan. Hablar no es señal de debilidad, sino el primer paso para recuperar tu tranquilidad."
          : "Comprendiste que tus acciones dejaban heridas invisibles. Elegiste detener el ciclo de violencia; pedir perdón y cambiar demuestra verdadera fuerza.";
        
        return (
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h2 className="modal-title" style={{fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
              <img src={asset('FINAL.png')} alt="Final" style={{ height: '40px', objectFit: 'contain' }} /> 
              LLEGASTE AL FINAL
            </h2>
            <p className="modal-body" style={{color:'#10b981', fontSize:'1.5rem', marginBottom: '10px'}}>
              {isVictim ? '¡Has llegado a la meta con la Valentía necesaria!' : '¡Has logrado cambiar! Terminaste con Empatía.'}
            </p>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #fbbf24', marginBottom: '20px', textAlign: 'left' }}>
              <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '5px' }}>Reflexión Final:</strong>
              <span style={{ fontStyle: 'italic', color: '#e2e8f0' }}>{reflection}</span>
            </div>
            <button className="close-btn" style={{ background: '#10b981', color: 'white', float: 'none', display: 'block', margin: '20px auto 0', textAlign: 'center' }} onClick={closeModalAndSwitchTurn}>Dejar jugar a los demás</button>
          </div>
        );
    }

    if (activeModal.type === 'repetition') {
        const neededText = activePlayer?.role === 'victim' ? '5 puntos de Valentía' : '5 puntos de Empatía';
        return (
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h2 className="modal-title" style={{color:'#fbbf24', fontSize: '2rem'}}>🔄 NO ESTÁS LISTO</h2>
            <p className="modal-body" style={{ textAlign: 'center' }}>Has llegado a la Casilla 20, pero no tienes los {neededText} necesarios. Vuelves a la Casilla 11 para intentarlo por última vez.</p>
            <button className="close-btn" style={{ background: '#fbbf24', color: '#0f172a', margin: '20px auto 0', display: 'block', float: 'none' }} onClick={closeModalAndSwitchTurn}>Aceptar y volver atrás</button>
          </div>
        );
    }

    if (activeModal.type === 'neutral_ending') {
        const isVictim = activeModal.role === 'victim';
        const reflection = isVictim
          ? "El silencio pesa. Aunque el camino haya sido difícil y no encontraste la fuerza esta vez, recuerda que nunca es tarde para buscar ayuda."
          : "Te dejaste llevar por el ego y perdiste la oportunidad de cambiar. Las cicatrices que provocaste seguirán ahí, al igual que las consecuencias de tus actos.";
        
        return (
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h2 className="modal-title" style={{fontSize: '2.5rem', color: '#94a3b8'}}>DESENLACE NEUTRO</h2>
            <p className="modal-body">No lograste reunir los requisitos necesarios a pesar de la segunda oportunidad. La situación se mantiene igual para ti. Has terminado tu recorrido.</p>
            <div style={{ background: 'rgba(148, 163, 184, 0.1)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #94a3b8', marginBottom: '20px', textAlign: 'left' }}>
              <strong style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Reflexión Final:</strong>
              <span style={{ fontStyle: 'italic', color: '#e2e8f0' }}>{reflection}</span>
            </div>
            <button className="close-btn" style={{ background: '#94a3b8', color: '#0f172a', float: 'none', display: 'block', margin: '20px auto 0', textAlign: 'center' }} onClick={closeModalAndSwitchTurn}>Dejar jugar a los demás</button>
          </div>
        );
    }

    if (activeModal.type === 'consecuencia') {
      const { card, count, isPowerPenalty, powerPenaltyReason } = activeModal;
      return (
        <FlipCardModalWrapper cardType="consecuencia">
          <div className="modal-content card-style consecuencia" style={{ border: '3px solid #ef4444', textAlign: 'center', background: 'var(--color-gris-100)', padding: '15px' }}>
            <h2 className="modal-title" style={{ color: '#ef4444', fontSize: '1.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '10px', wordWrap: 'break-word', whiteSpace: 'normal', lineHeight: '1.2' }}>
              CONSECUENCIA: {card.name.toUpperCase()}
            </h2>
            
            <img 
              src={asset(`consecuencia_${card.id}.jpeg`)} 
              onError={(e) => {
                 e.target.style.display = 'none';
              }} 
              alt={card.name} 
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', display: 'block', backgroundColor: 'rgba(0,0,0,0.1)' }} 
            />

            <p className="modal-body" style={{ textAlign: 'center', marginBottom: '15px' }}>{card.text}</p>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', color: '#ef4444', textAlign: 'center', marginBottom: '15px' }}>
              <p><strong>Efecto:</strong> {renderTextWithIcons(card.effect)}</p>
            </div>

            {isPowerPenalty && (
               <div style={{ background: 'rgba(180, 29, 29, 0.15)', padding: '10px', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #ef4444', textAlign: 'left', fontSize: '0.85rem' }}>
                 <strong style={{ color: '#ef4444' }}>Contexto:</strong> 
                 {powerPenaltyReason === 'accumulate'
                    ? ' Recibes esta consecuencia por acumular 5 puntos de Poder.'
                    : ' Recibes esta consecuencia por el uso excesivo de tu Poder.'}
               </div>
            )}

            {count > 1 && <p style={{fontSize:'0.7rem', color:'#94a3b8', marginTop:'5px', textAlign: 'center'}}>(Se aplica una consecuencia).</p>}
            
            <button className="close-btn" style={{ background: '#ef4444', margin: 'auto auto 0', display: 'block', float: 'none', width: '100%' }} onClick={() => applyConsequenceAndClose(card)}>Aceptar Castigo</button>
          </div>
        </FlipCardModalWrapper>
      );
    }

    const { cell, eventCard } = activeModal;
    const role = activePlayer?.role;

    if (cell.type === 'inicio' || cell.type === 'final') {
      return (
        <div className="modal-content">
          <h2 className="modal-title">{cell.name}</h2>
          <p className="modal-body">{cell.narration}</p>
          <button className="close-btn" onClick={closeModalAndSwitchTurn}>Continuar</button>
        </div>
      );
    }

    if (cell.type === 'avance') {
      const text = role === 'victim' ? cell.victimText : cell.bullyText;
      return (
        <div className="modal-content avance" style={{ textAlign: 'center' }}>
          <h2 className="modal-title" style={{ textAlign: 'center', fontSize: '1.6rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#10b981' }}>🟢 AVANCE: {cell.name.toUpperCase()} 🟢</h2>
          <p className="modal-body" style={{ textAlign: 'center' }}>{text}</p>
          <button className="close-btn" style={{ background: '#10b981', margin: '20px auto 0', display: 'block', float: 'none' }} onClick={closeModalAndSwitchTurn}>Continuar</button>
        </div>
      );
    }

    if (cell.type === 'interaccion') {
      return (
        <FlipCardModalWrapper cardType="evento">
          <div className="modal-content card-style interaccion" style={{ textAlign: 'center', border: '3px solid #26539D', background: 'var(--color-gris-100)', padding: '15px' }}>
            <h2 className="modal-title" style={{ textAlign: 'center', fontSize: '1.35rem', color: '#26539D', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '10px', wordWrap: 'break-word', whiteSpace: 'normal', lineHeight: '1.2' }}>
              EVENTO: {eventCard.name.toUpperCase()}
            </h2>
            <img 
              src={asset(`evento_${eventCard.id}.jpg`)} 
              onError={(e) => {
                 if (e.target.src.endsWith('.jpg')) {
                     e.target.src = asset(`evento_${eventCard.id}.png`);
                 } else {
                     e.target.style.display = 'none';
                 }
              }} 
              alt={eventCard.name} 
              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', display: 'block', backgroundColor: 'rgba(0,0,0,0.1)' }} 
            />
            <p className="modal-body" style={{ textAlign: 'center', marginBottom: '15px' }}>{eventCard.text}</p>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', textAlign: 'center', marginBottom: '15px' }}>
              <p><strong>Efecto para ti ({role === 'victim' ? 'Víctima' : 'Agresor'}):</strong></p>
              <p>{renderTextWithIcons(role === 'victim' ? eventCard.victimEffect : eventCard.bullyEffect)}</p>
            </div>
            <button className="close-btn" style={{ background: '#26539D', margin: 'auto auto 0', display: 'block', float: 'none', width: '100%' }} onClick={() => handleEventCard(eventCard, role)}>Aceptar y Continuar</button>
          </div>
        </FlipCardModalWrapper>
      );
    }

    if (cell.type === 'decision') {
      const options = role === 'victim' ? cell.victimOptions : cell.bullyOptions;
      return (
        <div className="modal-content decision">
          <h2 className="modal-title" style={{ textAlign: 'center', fontSize: '1.6rem', color: '#B41D1D', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', wordWrap: 'break-word', whiteSpace: 'normal', lineHeight: '1.2' }}>
            <img src={asset('DECISION.png')} alt="Decisión" style={{ height: '32px', objectFit: 'contain' }} />
            DECISIÓN: {cell.name.toUpperCase()}
          </h2>
          <p className="modal-body">{cell.narration}</p>
          <div className="modal-options">
            {options.map((opt, i) => {
              const isDisabled = role === 'victim' && opt.requires && activePlayer.stats.aliados < parseInt(opt.requires.charAt(0));
              return (
                <button 
                  key={i} 
                  className="option-btn" 
                  disabled={isDisabled}
                  style={{ opacity: isDisabled ? 0.5 : 1 }}
                  onClick={() => handleDecision(opt, role)}
                >
                  <strong>{opt.letter}. {opt.text}</strong>
                  <div className="option-effect">{renderTextWithIcons(opt.effect)}</div>
                  {opt.requires && <div className="option-effect" style={{color: '#ef4444'}}>Requiere: {renderTextWithIcons(opt.requires)}</div>}
                </button>
              )
            })}
          </div>
        </div>
      );
    }
  };

  if (gamePhase === 'landing') {
    return (
      <>
        <Navbar 
          onHomeClick={handleReturnToHome} 
          showPlayButton={true}
          onPlayClick={() => setGamePhase('character_selection')}
        />
        <MuteButton gamePhase={gamePhase} />
        <LandingScreen onStart={() => setGamePhase('character_selection')} />
      </>
    );
  }

  if (gamePhase === 'character_selection') {
    return (
      <>
        <Navbar onHomeClick={handleReturnToHome} showPlayButton={false} />
        <MuteButton gamePhase={gamePhase} />
        <CharacterSelectionScreen 
          onStartGame={(selectedPlayers) => {
            const initializedPlayers = selectedPlayers.map(p => ({
              ...p,
              pos: 1,
              stats: p.role === 'victim' ? { valentia: 1, aliados: 0 } : { empatia: 0, poder: 1, consecuencias: 0, poderGastado: 0 },
              skipNextTurn: false,
              skipNextInteraction: false,
              powerUsedThisTurn: false,
              finished: false,
              secondChanceUsed: false
            }));
            setPlayers(initializedPlayers);
            setActivePlayerIndex(0);
            setGamePhase('playing');
          }} 
          onBack={() => setGamePhase('landing')}
        />
      </>
    );
  }

  const isModoReflexion = players.length === 1;

  return (
    <>
      <Navbar onHomeClick={handleReturnToHome} showPlayButton={false} />
      <MuteButton gamePhase={gamePhase} />
      
      {diceMessage && (
        <div style={{
          position: 'fixed',
          top: '120px', // Mayor separación del Navbar
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 9999999
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            border: '2px solid var(--color-sec-amarillo)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            animation: 'fadeInOut 2.5s ease-in-out forwards',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            {diceMessage}
          </div>
        </div>
      )}

      <div className="app-container">
      <div className="board-area" style={{ position: 'relative', flex: 1 }}>
        {/* 2D Deck Overlay */}
        <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 15, display: 'flex', gap: '30px', pointerEvents: 'auto' }}>
          {/* Mazo Evento */}
          <div style={{ position: 'relative', transform: 'rotate(-8deg)', transition: 'transform 0.2s ease-out', filter: 'drop-shadow(4px 6px 8px rgba(0,0,0,0.6))', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(-8deg) translateY(-15px) scale(1.05)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-8deg)'}
               onClick={() => setInfoModal('evento')}
               title="Mazo de Eventos"
          >
            <img src={asset('dorso_evento.png')} alt="" style={{ width: '100px', height: '150px', objectFit: 'contain', position: 'absolute', top: '6px', left: '6px', filter: 'brightness(0.3)' }} />
            <img src={asset('dorso_evento.png')} alt="" style={{ width: '100px', height: '150px', objectFit: 'contain', position: 'absolute', top: '3px', left: '3px', filter: 'brightness(0.6)' }} />
            <img src={asset('dorso_evento.png')} alt="Mazo Eventos" style={{ width: '100px', height: '150px', objectFit: 'contain', position: 'relative' }} />
          </div>
          
          {/* Mazo Consecuencia */}
          <div style={{ position: 'relative', transform: 'rotate(12deg)', transition: 'transform 0.2s ease-out', filter: 'drop-shadow(4px 6px 8px rgba(0,0,0,0.6))', marginTop: '15px', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(12deg) translateY(-15px) scale(1.05)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(12deg)'}
               onClick={() => setInfoModal('consecuencia')}
               title="Mazo de Consecuencias"
          >
            <img src={asset('dorso_consecuencia.png')} alt="" style={{ width: '100px', height: '150px', objectFit: 'contain', position: 'absolute', top: '6px', left: '-6px', filter: 'brightness(0.3)' }} />
            <img src={asset('dorso_consecuencia.png')} alt="" style={{ width: '100px', height: '150px', objectFit: 'contain', position: 'absolute', top: '3px', left: '-3px', filter: 'brightness(0.6)' }} />
            <img src={asset('dorso_consecuencia.png')} alt="Mazo Consecuencias" style={{ width: '100px', height: '150px', objectFit: 'contain', position: 'relative' }} />
          </div>
        </div>

        {/* Turn Indicator Overlay */}
        <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 20, pointerEvents: 'none' }}>
          <div className="turn-indicator" style={{ background: 'rgba(26, 28, 35, 0.85)', padding: '10px 25px', borderRadius: '30px', border: '2px solid var(--color-sec-amarillo)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', textAlign: 'left', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--color-main-blanco)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Turno de:</span>
            <span style={{ color: 'var(--color-sec-amarillo)', fontSize: '1.4rem', fontWeight: 'bold' }}>{CHARACTERS.find(c => c.id === activePlayer?.charId)?.name || 'Desconocido'}</span>
          </div>
        </div>

          {/* Render 3D Board */}
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Board3D players={players} isRolling={isRolling} diceResult={diceResult} isDiceFading={isDiceFading} />
          </div>
      </div>

      <div className="hud-area" style={{ width: '350px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10 }}>
        
        <div className="hud-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'hidden', paddingRight: '0' }}>
          {players.map((p, i) => {
             const isActive = i === activePlayerIndex;
             const isVictim = p.role === 'victim';
             const charData = CHARACTERS.find(c => c.id === p.charId);
             
             return (
               <div key={p.id} className="hud-section" style={{ 
                 border: isActive ? `2px solid ${isVictim ? '#26539D' : '#B41D1D'}` : '1px solid transparent', 
                 opacity: p.finished ? 0.4 : 1,
                 marginBottom: 0,
                 padding: '10px',
                 flexShrink: 0
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img src={asset(`char_${charData.id}.png`)} alt={charData.name} style={{ width: '40px', height: '40px', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%', border: `2px solid ${isVictim ? '#26539D' : '#B41D1D'}` }} />
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 className="hud-title" style={{ color: '#FBBF24', fontSize: '1.1rem', margin: 0 }}>
                          {charData?.name} {p.finished && '🏁'}
                        </h2>
                        <span style={{ color: isVictim ? '#4da2ff' : '#ff6b6b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {isVictim ? '😔 Víctima' : '😤 Agresor'}
                        </span>
                      </div>
                   </div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                     <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>Casilla</span>
                     <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>{p.pos}</span>
                   </div>
                 </div>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.85rem' }}>
                   {isVictim ? (
                     <>
                       <div className="stat-row" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                         <img src={asset('Valentía.png')} alt="Valentía" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                         <span>Valentía:</span> 
                         <span className="stat-value" style={{ marginLeft: 'auto' }}>{p.stats.valentia}</span>
                       </div>
                       <div className="stat-row" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                         <img src={asset('Aliado.png')} alt="Aliado" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                         <span>Aliados:</span> 
                         <span className="stat-value" style={{ marginLeft: 'auto' }}>{p.stats.aliados}</span>
                       </div>
                     </>
                   ) : (
                     <>
                       <div className="stat-row" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                         <img src={asset('Empatía.png')} alt="Empatía" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                         <span>Empatía:</span> 
                         <span className="stat-value" style={{ marginLeft: 'auto' }}>{p.stats.empatia}</span>
                       </div>
                       <div className="stat-row" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                         <img src={asset('Poder.png')} alt="Poder" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                         <span>Poder:</span> 
                         <span className="stat-value" style={{ marginLeft: 'auto' }}>{p.stats.poder}</span>
                       </div>
                       <div className="stat-row" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                         <AlertTriangle size={24} color="#ef4444" />
                         <span>Consecuencias:</span> 
                         <span className="stat-value" style={{ marginLeft: 'auto' }}>{p.stats.consecuencias}</span>
                       </div>
                     </>
                   )}
                 </div>

                 {/* Bully Powers */}
                 {isActive && !isVictim && !p.finished && !isModoReflexion && (
                   <div className="bully-actions" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                     <p style={{fontSize:'0.7rem', color:'#94a3b8', marginBottom:'5px', textAlign: 'center'}}>Usar Poder (Gasta <img src={asset('Poder.png')} alt="Poder" style={{ width: '10px', height: '10px', verticalAlign: 'middle' }} />)</p>
                     <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        <button 
                           disabled={p.stats.poder < 1 || isRolling || activeModal !== null || p.powerUsedThisTurn} 
                           onClick={() => handleUsePowerClick(1)}
                           style={{ flex: 1, fontSize: '0.7rem', padding: '4px', background: 'rgba(180, 29, 29, 0.2)', color:'white', border:'1px solid #B41D1D', borderRadius:'4px', cursor: p.powerUsedThisTurn ? 'not-allowed' : 'pointer', opacity: p.stats.poder < 1 || p.powerUsedThisTurn ? 0.3 : 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px'}}
                        >
                           -1 <img src={asset('Poder.png')} alt="Poder" style={{ width: '10px', height: '10px' }} /> Retrocede 1
                        </button>
                        <button 
                           disabled={p.stats.poder < 2 || isRolling || activeModal !== null || p.powerUsedThisTurn} 
                           onClick={() => handleUsePowerClick(2)}
                           style={{ flex: 1, fontSize: '0.7rem', padding: '4px', background: 'rgba(180, 29, 29, 0.2)', color:'white', border:'1px solid #B41D1D', borderRadius:'4px', cursor: p.powerUsedThisTurn ? 'not-allowed' : 'pointer', opacity: p.stats.poder < 2 || p.powerUsedThisTurn ? 0.3 : 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px'}}
                        >
                           -2 <img src={asset('Poder.png')} alt="Poder" style={{ width: '10px', height: '10px' }} /> Bloqueo
                        </button>
                        <button 
                           disabled={p.stats.poder < 3 || isRolling || activeModal !== null || p.powerUsedThisTurn} 
                           onClick={() => handleUsePowerClick(3)}
                           style={{ flex: 1, fontSize: '0.7rem', padding: '4px', background: 'rgba(180, 29, 29, 0.2)', color:'white', border:'1px solid #B41D1D', borderRadius:'4px', cursor: p.powerUsedThisTurn ? 'not-allowed' : 'pointer', opacity: p.stats.poder < 3 || p.powerUsedThisTurn ? 0.3 : 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px'}}
                        >
                           -3 <img src={asset('Poder.png')} alt="Poder" style={{ width: '10px', height: '10px' }} /> -1 <img src={asset('Valentía.png')} alt="Valentía" style={{ width: '10px', height: '10px' }} />
                        </button>
                      </div>
                   </div>
                 )}
                </div>
              );
           })}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isModoReflexion && (
            <div style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.5)', fontWeight: 'bold', textAlign: 'center', fontSize: '0.85rem', letterSpacing: '1px' }}>
              🧠 MODO REFLEXIÓN (Sin Agresiones)
            </div>
          )}

          {!activePlayer?.finished && (
            <button 
              className="dice-icon-btn" 
              onClick={rollDice} 
              disabled={isRolling || isMoving || activeModal !== null || targetPowerModal !== null}
              title={isRolling ? 'Lanzando...' : isMoving ? 'Moviendo...' : 'Lanzar Dado'}
            >
              <img src={asset('Dado.png')} alt="Lanzar Dado" style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.4))' }} />
            </button>
          )}
        </div>
      </div>

      {activeModal && !isMoving && (
        <div className="modal-overlay">
          {renderModalContent()}
        </div>
      )}

      {targetPowerModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
           <div className="modal-content" style={{ border: '2px solid #B41D1D' }}>
             <h2 className="modal-title" style={{ color: '#B41D1D', textAlign: 'center', fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>🎯 ELEGIR OBJETIVO 🎯</h2>
             <p className="modal-body" style={{ textAlign: 'center' }}>Selecciona a la víctima que recibirá el efecto del poder:</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
               {targetPowerModal.targets.map(target => (
                 <button 
                   key={target.id}
                   className="option-btn" 
                   onClick={() => executeBullyPower(targetPowerModal.cost, target.id)}
                 >
                   {CHARACTERS.find(c => c.id === target.charId)?.name} (Casilla {target.pos})
                 </button>
               ))}
               <button className="close-btn" style={{ background: '#475569', marginTop: '10px' }} onClick={() => setTargetPowerModal(null)}>Cancelar</button>
             </div>
           </div>
        </div>
      )}

      {infoModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ border: infoModal === 'evento' ? '2px solid #26539D' : '2px solid #ef4444' }}>
            <h2 className="modal-title" style={{ color: infoModal === 'evento' ? '#26539D' : '#ef4444', textAlign: 'center', fontSize: '1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <img src={infoModal === 'evento' ? asset('dorso_evento.png') : asset('dorso_consecuencia.png')} alt="Icono" style={{ width: '24px', height: '36px', objectFit: 'contain' }} />
              {infoModal === 'evento' ? 'MAZO DE EVENTOS' : 'MAZO DE CONSECUENCIAS'}
              <img src={infoModal === 'evento' ? asset('dorso_evento.png') : asset('dorso_consecuencia.png')} alt="Icono" style={{ width: '24px', height: '36px', objectFit: 'contain' }} />
            </h2>
            <p className="modal-body" style={{ textAlign: 'center', marginTop: '15px' }}>
              {infoModal === 'evento' 
                ? 'Las cartas de Evento dictan situaciones impredecibles del entorno escolar al caer en las casillas marcadas. Pueden otorgarte ventajas clave, hacerte reflexionar sobre tus acciones, o ponerte obstáculos en el camino.' 
                : 'Las cartas de Consecuencia son sanciones graves. Se aplican principalmente como castigo al Agresor si abusa desmedidamente de su Poder (cada 3 puntos gastados o al acumular 5), o por caer en ciertas casillas trampa.'}
            </p>
            <button className="close-btn" style={{ background: infoModal === 'evento' ? '#26539D' : '#ef4444', display: 'block', margin: '20px auto 0', float: 'none' }} onClick={() => setInfoModal(null)}>Entendido</button>
          </div>
        </div>
      )}

    </div>
    </>
  );
}

export default App;
