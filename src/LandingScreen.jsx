import React, { useState, useEffect, useRef } from 'react';
import { asset } from './utils';
import { Users, Clock, ShieldCheck, BookOpen, Info, Target, Dice5, Layers, Zap, RotateCcw } from 'lucide-react';
import './LandingScreen.css';

const QUOTE_TEXT = 'Suena la alarma. Otro día. No sabes lo que te espera hoy.';

export default function LandingScreen({ onStart }) {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const typingDone = useRef(false);
  const audioRef = useRef(null);



  // Typewriter effect
  useEffect(() => {
    if (typingDone.current) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTypedText(QUOTE_TEXT.slice(0, i));
      if (i >= QUOTE_TEXT.length) {
        clearInterval(timer);
        typingDone.current = true;
        // Keep cursor blinking for a moment, then hide
        setTimeout(() => setShowCursor(false), 2500);
      }
    }, 55);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing">
      {/* Background */}
      <div className="landing__bg">
        <img src={asset('fondo_landing.jpg')} alt="Pasillo escolar" />
        <div className="landing__bg-overlay" />
      </div>

      {/* Floating particles */}
      <div className="landing__particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Vignette */}
      <div className="landing__vignette" />

      {/* Main content */}
      <div className="landing__content">
        
        {/* LEFT SIDE: Logo */}
        <div className="landing__left">
          <div className="landing__logo-wrapper">
            <img className="landing__logo" src={asset('logo.png')} alt="Nadie Vio Nada" />
          </div>
        </div>

        {/* RIGHT SIDE: Content */}
        <div className="landing__right">
          {/* Tagline */}
          <p className="landing__tagline">Un juego sobre el bullying</p>

          {/* Typewriter quote */}
          <div className="landing__quote-wrapper">
            <p className="landing__quote">
              "{typedText}"
              {showCursor && <span className="landing__cursor" />}
            </p>
          </div>

          {/* Game info badges */}
          <div className="landing__info">
            <div className="landing__badge">
              <span className="landing__badge-icon"><Users size={16} /></span>
              2 – 4 Jugadores
            </div>
            <div className="landing__badge">
              <span className="landing__badge-icon"><Clock size={16} /></span>
              20 – 40 min
            </div>
            <div className="landing__badge">
              <span className="landing__badge-icon"><ShieldCheck size={16} /></span>
              +13 años
            </div>
          </div>

          {/* CTA & Actions */}
          <div className="landing__actions">
            <button className="landing__cta" onClick={onStart}>
              <span className="landing__cta-shine" />
              JUGAR AHORA
            </button>
          </div>
        </div>
        
      </div>

      <div className="landing__footer">
        <span>Diseño de Interacción — 7mo Semestre — 2026</span>
        <span className="landing__footer-credits">Proyecto académico universitario</span>
      </div>
    </div>
  );
}
