import React, { useState } from 'react';
import { asset } from './utils';
import { Home, BookOpen, Info, Target, Dice5, Layers, Zap, RotateCcw, Play } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onHomeClick, onPlayClick, showPlayButton }) {
  const [showRules, setShowRules] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <nav className="global-navbar">
        <div className="navbar-left">
          <img src={asset('logo.png')} alt="Nadie Vio Nada" className="navbar-logo" onClick={onHomeClick} style={{ cursor: 'pointer' }} />
        </div>
        
        <div className="navbar-right">
          <button className="navbar-link" onClick={onHomeClick}>
            <Home size={18} /> Inicio
          </button>
          <button className="navbar-link" onClick={() => setShowRules(true)}>
            <BookOpen size={18} /> Cómo Jugar
          </button>
          <button className="navbar-link" onClick={() => setShowAbout(true)}>
            <Info size={18} /> Sobre el Proyecto
          </button>
          {showPlayButton && (
            <button className="navbar-cta-btn" onClick={onPlayClick}>
              <Play size={18} /> JUGAR AHORA
            </button>
          )}
        </div>
      </nav>

      {/* Rules Modal */}
      {showRules && (
        <div className="landing__rules-overlay" onClick={() => setShowRules(false)} style={{ zIndex: 2000 }}>
          <div className="landing__rules-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={28} /> CÓMO JUGAR</h2>
            
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={20} /> Objetivo</h3>
            <p>
              <strong>Víctima:</strong> Acumula <strong>5+ tokens de Valentía ⭐</strong> para ganar con dignidad.<br />
              <strong>Bully:</strong> Acumula <strong>5+ tokens de Empatía ❤️</strong> para lograr la redención.
            </p>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Dice5 size={20} /> Tu Turno</h3>
            <ul>
              <li><strong>Lanza el dado:</strong> 1-2 = avanza 1 casilla, 3-4 = avanza 2, 5-6 = avanza 3.</li>
              <li><strong>Resuelve la casilla:</strong> Lee la narración, roba una carta o toma una decisión.</li>
              <li><strong>Las Decisiones (❗) son parada obligatoria</strong> — no puedes saltarlas.</li>
            </ul>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={20} /> Tipos de Casilla</h3>
            <ul>
              <li>🏁 <strong>Inicio/Final</strong> — Comienza y termina el día.</li>
              <li>➡️ <strong>Avance</strong> — Lee la narración de tu rol.</li>
              <li>🔄 <strong>Interacción</strong> — Roba una Carta de Evento.</li>
              <li>❗ <strong>Decisión</strong> — Elige entre opciones con consecuencias reales.</li>
            </ul>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={20} /> El Poder del Bully</h3>
            <p>
              El Poder da ventajas a corto plazo, pero <strong>cada uso activa una Carta de Consecuencia</strong>.
              Acumular 5+ Poder roba 2 Consecuencias automáticamente. ¡Es un arma de doble filo!
            </p>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RotateCcw size={20} /> ¿Qué pasa si no ganas?</h3>
            <p>
              Si llegas a la casilla 20 sin los puntos necesarios, vuelves a la casilla 11.
              Tienes <strong>una segunda oportunidad</strong>. Si tampoco lo logras, el problema no se resolvió.
            </p>

            <button className="landing__rules-close" onClick={() => setShowRules(false)}>
              ENTENDIDO
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="landing__rules-overlay" onClick={() => setShowAbout(false)} style={{ zIndex: 2000 }}>
          <div className="landing__rules-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Info size={28} /> SOBRE EL PROYECTO</h2>
            
            <div className="landing__about-section">
              <h3>El Contexto</h3>
              <p>
                <strong>"Nadie Vio Nada"</strong> es un juego de mesa analógico y ahora adaptado a formato web interactivo. 
                Nace como un proyecto académico enfocado en abordar la problemática del bullying escolar desde una perspectiva de roles (Víctima y Bully).
              </p>
            </div>

            <div className="landing__about-section">
              <h3>El Objetivo</h3>
              <p>
                Buscamos generar empatía y conciencia a través de la toma de decisiones narrativas. 
                Las consecuencias en el juego reflejan el peso emocional de las acciones cotidianas en el entorno escolar.
              </p>
            </div>

            <div className="landing__about-section">
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', marginBottom: '15px' }}>Créditos del Proyecto</h3>
              <div className="landing__team-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                <div className="landing__team-member" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                  <img src={asset('peter.jpg')} alt="Peter Orostegui Mojica" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #3b82f6', marginBottom: '10px' }} />
                  <strong style={{ color: '#3b82f6', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>🎮 Desarrollador y Creador</strong>
                  <span style={{ fontSize: '1rem' }}>Peter Orostegui Mojica</span>
                </div>
                <div className="landing__team-member" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                  <img src={asset('elizabeth.jpg')} alt="Elizabeth Alarcon Pantoja" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10b981', marginBottom: '10px' }} />
                  <strong style={{ color: '#10b981', display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>👩‍🏫 Docente de la Materia</strong>
                  <span style={{ fontSize: '1rem' }}>Elizabeth Alarcon Pantoja</span>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Diseño de Interacción — 7mo Semestre (2026)</span>
                </div>
                <div className="landing__team-member" style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', textAlign: 'center', width: '100%' }}>
                  <strong style={{ color: '#fbbf24', display: 'block', fontSize: '1.1rem', marginBottom: '8px' }}>🛠️ Herramientas Utilizadas</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    <span>🎨 <strong>Figma</strong> Maquetación y prototipado inicial de la experiencia.</span>
                    <span>🤖 <strong>Gemini AI</strong> Asistencia en la creación de la estructura en código.</span>
                    <span>🤖 <strong>Claude AI</strong> Asistencia en la creación de la estructura en código.</span>
                    <span>🖼️ <strong>Flow by Google</strong> Generación de assets y material gráfico.</span>
                    <span>⚛️ <strong>React + Vite</strong> Framework y bundler de la aplicación web.</span>
                    <span>🎲 <strong>Three.js</strong> Motor 3D para animaciones y dado interactivo.</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="landing__rules-close" onClick={() => setShowAbout(false)}>
              CERRAR
            </button>
          </div>
        </div>
      )}
    </>
  );
}
