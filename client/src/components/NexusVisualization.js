import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: 
      linear-gradient(
        rgba(16, 23, 41, 0) 50%, 
        rgba(16, 23, 41, 0.25) 50%
      ),
      linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06),
        rgba(0, 255, 0, 0.02),
        rgba(0, 0, 255, 0.06)
      );
    background-size: 100% 2px, 3px 100%;
    z-index: 2;
  }
`;

const OverlayText = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  color: rgba(230, 192, 123, 0.7);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  z-index: 10;
  pointer-events: none;
  background-color: rgba(16, 23, 41, 0.5);
  padding: 5px 8px;
  border-left: 2px solid #61afef;
`;

// Brain/Nexus component
function Brain() {
  const brainRef = useRef();
  
  useFrame(() => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={brainRef}>
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial 
          color="#61afef" 
          emissive="#2c5a88"
          roughness={0.4}
          metalness={0.8}
          wireframe={true}
        />
      </Sphere>
      <Sphere args={[0.9, 32, 32]}>
        <meshStandardMaterial 
          color="#61afef" 
          emissive="#2c5a88"
          transparent={true}
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={2} color="#61afef" />
    </group>
  );
}

// Player node component
function PlayerNode({ index, totalPlayers, player, active }) {
  const nodeRef = useRef();
  const orbitRadius = 3;
  const orbitSpeed = 0.001 * (index + 1);
  const startAngle = (index / totalPlayers) * Math.PI * 2;
  
  useFrame(({ clock }) => {
    if (nodeRef.current) {
      const angle = startAngle + clock.getElapsedTime() * orbitSpeed;
      nodeRef.current.position.x = Math.cos(angle) * orbitRadius;
      nodeRef.current.position.z = Math.sin(angle) * orbitRadius;
      nodeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={nodeRef}>
      <Sphere args={[0.4, 24, 24]}>
        <meshStandardMaterial 
          color={active ? "#98c379" : "#e6c07b"} 
          emissive={active ? "#5c7944" : "#a6884c"}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      <pointLight position={[0, 0, 0]} intensity={0.8} color={active ? "#98c379" : "#e6c07b"} />
      <Html position={[0, 0.7, 0]}>
        <PlayerLabel active={active}>{player.username}</PlayerLabel>
      </Html>
    </group>
  );
}

// Connection lines between Nexus and player nodes
function ConnectionLines({ players, activePlayer }) {
  const linesRef = useRef();
  
  useFrame(({ scene }) => {
    if (linesRef.current) {
      // Find the brain and player nodes in the scene
      const brain = scene.getObjectByName('brain');
      const playerNodes = players.map((_, i) => 
        scene.getObjectByName(`player-${i}`)
      );
      
      // Update line positions
      if (brain && playerNodes.every(node => node)) {
        const brainPosition = new THREE.Vector3();
        brain.getWorldPosition(brainPosition);
        
        playerNodes.forEach((node, i) => {
          const nodePosition = new THREE.Vector3();
          node.getWorldPosition(nodePosition);
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            brainPosition,
            nodePosition
          ]);
          
          const line = linesRef.current.children[i];
          line.geometry.dispose();
          line.geometry = lineGeometry;
        });
      }
    }
  });

  return (
    <group ref={linesRef}>
      {players.map((player, i) => (
        <line key={i}>
          <bufferGeometry />
          <lineBasicMaterial 
            color={activePlayer === i ? "#98c379" : "#e6c07b"} 
            linewidth={1} 
            opacity={0.7} 
            transparent 
          />
        </line>
      ))}
    </group>
  );
}

const PlayerLabel = styled.div`
  background-color: rgba(22, 33, 62, 0.8);
  color: ${props => props.active ? '#98c379' : '#e6c07b'};
  padding: 4px 8px;
  border: 1px solid ${props => props.active ? '#98c379' : '#e6c07b'};
  font-size: 12px;
  white-space: nowrap;
  font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 1px;
`;

// Scene component that uses the useFrame hook
function NexusScene({ players, activePlayerIndex }) {
  const frameCount = useRef(0);
  
  useFrame(() => {
    frameCount.current += 1;
  });
  
  return (
    <>
      <color attach="background" args={['#16213e']} />
      <fog attach="fog" args={['#16213e', 5, 15]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      {/* Main Nexus/Brain */}
      <Brain name="brain" />
      
      {/* Player Nodes */}
      {players.map((player, i) => (
        <PlayerNode 
          key={i}
          name={`player-${i}`}
          index={i} 
          totalPlayers={players.length} 
          player={player}
          active={i === activePlayerIndex}
        />
      ))}
      
      {/* Connection Lines */}
      <ConnectionLines 
        players={players} 
        activePlayer={activePlayerIndex} 
      />
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

function NexusVisualization({ players, activePlayerIndex }) {
  return (
    <CanvasContainer>
      <Canvas camera={{ position: [0, 2, 7], fov: 60 }}>
        <NexusScene players={players} activePlayerIndex={activePlayerIndex} />
      </Canvas>
      
      <OverlayText>
        NEXUS VISUALIZATION v2.1 • ACTIVE NODES: {players.length} • SYSTEM STABLE
      </OverlayText>
    </CanvasContainer>
  );
}

export default NexusVisualization;
