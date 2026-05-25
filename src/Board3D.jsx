import React, { useMemo } from 'react';
import { asset } from './utils';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CHARACTERS } from './data';
import { useSpring, animated } from '@react-spring/three';
import { CELL_COORDS } from './data';
import Dice3D from './Dice3D';

// Mapea porcentajes 2D (0-100) a coordenadas 3D (-5 a 5) en un plano de 10x10
const getPosition3D = (pos2D, offset = [0,0,0]) => {
  const x = (pos2D.x / 100) * 10 - 5 + offset[0];
  const z = (pos2D.y / 100) * 10 - 5 + offset[2];
  return [x, 0.4 + offset[1], z]; // 0.4 es la altura sobre el plano (eje Y en 3D)
};

const Token3D = ({ position2D, color, offset, avatar, name }) => {
  const targetPos = useMemo(() => getPosition3D(position2D, offset), [position2D, offset]);
  const { position } = useSpring({
    position: targetPos,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  // Carga la textura del avatar del personaje
  const texture = useTexture(avatar);
  
  // Calcula la relación de aspecto dinámica de la imagen para no deformarla
  const aspect = texture.image ? (texture.image.width / texture.image.height) : (3 / 4);
  const height = 1.1; 
  const width = height * aspect;

  return (
    <animated.group position={position}>
      {/* Base o peana del token (de color para identificar rápido si es agresor o víctima) */}
      <mesh castShadow receiveShadow position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Figura de cartón (Standee) que mira siempre a la cámara */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial map={texture} transparent={true} alphaTest={0.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Nombre del personaje flotando encima (HTML Badge) */}
        <Html position={[0, height / 2 + 0.35, 0]} center zIndexRange={[100, 0]}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 'bold',
            border: `2px solid ${color}`,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            {name}
          </div>
        </Html>
      </Billboard>
    </animated.group>
  );
};


const BoardMesh = () => {
  // Carga la imagen del tablero como textura
  const texture = useTexture(asset('tablero_bg.jpg'));

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial map={texture} roughness={0.8} />
    </mesh>
  );
};

const Board3D = ({ players = [], isRolling, diceResult, isDiceFading }) => {
  return (
    <Canvas shadows camera={{ position: [0, 8, 8], fov: 50 }}>
      <React.Suspense fallback={null}>
        {/* Controles de cámara */}
        <OrbitControls 
          makeDefault 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          maxDistance={20}
          minDistance={5}
        />

        {/* Iluminación */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      
        <BoardMesh />
        {diceResult !== null && <Dice3D isRolling={isRolling} result={diceResult} isFading={isDiceFading} />}

        {/* Las Fichas (Tokens) */}
        {players.map((p, index) => {
           const color = p.role === 'victim' ? '#26539D' : '#B41D1D'; // Azul y Rojo principales
           const offsets = [
              [-0.2, 0, -0.2],
              [ 0.2, 0,  0.2],
              [-0.2, 0,  0.2],
              [ 0.2, 0, -0.2]
           ];
           return (
             <Token3D 
               key={p.id} 
               position2D={CELL_COORDS[p.pos]} 
               color={color} 
               offset={offsets[index % 4]} 
               avatar={asset(`char_${p.charId}.png`)}
               name={CHARACTERS.find(c => c.id === p.charId)?.name || 'Jugador'}
             />
           );
        })}
      </React.Suspense>
    </Canvas>
  );
};

export default Board3D;
