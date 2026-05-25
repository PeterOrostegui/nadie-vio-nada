import React, { useState, useEffect } from 'react';
import { asset } from './utils';

const FlipCardModalWrapper = ({ cardType, children }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Retrasar el giro para dar sensación de pausa
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 600); // 0.6s suspense
    return () => clearTimeout(timer);
  }, []);

  const bgImage = cardType === 'evento' ? `url(${asset('dorso_evento.jpeg')})` : `url(${asset('dorso_consecuencia.jpeg')})`;

  return (
    <div className="modal-flip-container">
      <div className={`modal-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="modal-flip-front" style={{ backgroundImage: bgImage }}></div>
        <div className="modal-flip-back">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FlipCardModalWrapper;
