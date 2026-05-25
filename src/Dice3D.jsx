import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// Generador procedural de texturas de dado
const createDiceTexture = (number) => {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fondo (blanco hueso con bordes sutiles)
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, size, size);
  
  // Borde interior para simular redondez
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, size - 10, size - 10);

  // Color de los puntos
  ctx.fillStyle = '#1e293b';
  
  const drawDot = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
  };

  const center = size / 2;
  const offset = 60;

  // Lógica para dibujar los puntos
  if ([1, 3, 5].includes(number)) drawDot(center, center); // Centro
  if ([2, 3, 4, 5, 6].includes(number)) {
    drawDot(center - offset, center - offset); // Arriba Izquierda
    drawDot(center + offset, center + offset); // Abajo Derecha
  }
  if ([4, 5, 6].includes(number)) {
    drawDot(center + offset, center - offset); // Arriba Derecha
    drawDot(center - offset, center + offset); // Abajo Izquierda
  }
  if (number === 6) {
    drawDot(center - offset, center); // Medio Izquierda
    drawDot(center + offset, center); // Medio Derecha
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
};

const Dice3D = ({ isRolling, result, isFading }) => {
  // Generar las texturas una sola vez
  const materials = useMemo(() => {
    // Mapeo: +X(3), -X(4), +Y(1), -Y(6), +Z(2), -Z(5)
    return [
      new THREE.MeshStandardMaterial({ map: createDiceTexture(3), roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(4), roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(1), roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(6), roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(2), roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ map: createDiceTexture(5), roughness: 0.4 })
    ];
  }, []);

  // Determinar la rotación objetivo según el resultado para que quede hacia arriba (+Y)
  const getTargetRotation = (res) => {
    switch (res) {
      case 1: return [0, 0, 0];
      case 2: return [-Math.PI / 2, 0, 0];
      case 3: return [0, 0, Math.PI / 2];
      case 4: return [0, 0, -Math.PI / 2];
      case 5: return [Math.PI / 2, 0, 0];
      case 6: return [Math.PI, 0, 0];
      default: return [0, 0, 0];
    }
  };

  // Posición de reposo del dado en el tablero
  const restingPosition = [0, 0.25, 0];
  
  // Posición inicial de caída (alto en el aire)
  const startPosition = [0, 6, 0];

  // Configuración de la animación con React Spring
  const { position, rotation } = useSpring({
    from: {
      position: startPosition,
      rotation: [Math.PI * 4, Math.PI * 4, Math.PI * 4],
    },
    to: async (next) => {
      if (isRolling && result) {
        // 1. Teletransportar arriba con rotación aleatoria loca
        await next({ 
          position: startPosition, 
          rotation: [Math.random() * Math.PI * 4, Math.random() * Math.PI * 4, Math.random() * Math.PI * 4], 
          immediate: true 
        });
        
        const finalRot = getTargetRotation(result);
        
        // 2. Caer hacia el tablero, resolviendo la rotación final en el aire para no atravesar el suelo
        await next({
          position: [0, 1.0, 0],
          rotation: finalRot,
          config: { mass: 1.2, tension: 150, friction: 12 }
        });
        
        // 3. Impacto en el suelo
        await next({
          position: [0, 0.25, 0],
          rotation: finalRot,
          config: { mass: 1, tension: 300, friction: 10 }
        });

        // 4. Pequeño rebote
        await next({
          position: [0, 0.5, 0],
          rotation: finalRot,
          config: { mass: 1, tension: 200, friction: 15 }
        });
        
        // 5. Asentamiento final
        await next({
          position: restingPosition,
          rotation: finalRot,
          config: { mass: 1, tension: 250, friction: 20 }
        });
      }
    },
    // Si no está rodando, asegurar la posición y rotación correctas
    position: isRolling ? undefined : restingPosition,
    rotation: isRolling ? undefined : (result ? getTargetRotation(result) : [0, 0, 0]),
  });

  // Animación de desaparición (escala a 0)
  const { scale } = useSpring({
    scale: isFading ? [0, 0, 0] : [1, 1, 1],
    config: { tension: 300, friction: 20 }
  });

  return (
    <animated.mesh
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      {materials.map((mat, i) => <primitive object={mat} attach={`material-${i}`} key={i} />)}
    </animated.mesh>
  );
};

export default Dice3D;
